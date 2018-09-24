use std::fmt;
use std::str::FromStr;
extern crate serde;
extern crate serde_json;
extern crate failure;
use serde::ser::{Serialize, Serializer};
use serde::de::{Deserialize, Deserializer, Visitor};
use failure::format_err;

#[derive(Debug, PartialEq, Eq)]
pub enum PackageId {
  BuiltIn,
  Local {
    package: String
  },
  Market {
    user: String,
    package: String
  }
}

impl fmt::Display for PackageId {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    let fully_qualified_name = match self {
      PackageId::BuiltIn => "builtin".to_string(),
      PackageId::Local { package } => format!("local.{}", package),
      PackageId::Market { user, package } => format!("market.{}.{}", user, package)
    };

    write!(f, "{}", fully_qualified_name)
  }
}

impl Serialize for PackageId {
  fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
    serializer.serialize_str(&format!("{}", self))
  }
}

impl FromStr for PackageId {
  type Err = failure::Error;

  fn from_str(s: &str) -> Result<Self, Self::Err> {
    let mut segments = s.split(".");
    let mut next_segment = || segments.next().ok_or(
      format_err!("Package id does not have enough segments: {}", s)
    );

    let parsed = match next_segment()? {
      "builtin" => PackageId::BuiltIn,
      "local" => PackageId::Local {
        package: next_segment()?.to_string()
      },
      "market" => PackageId::Market {
        user: next_segment()?.to_string(),
        package: next_segment()?.to_string()
      },
      _ => Err(format_err!("Package id does not have valid type: {}", s))?
    };

    Ok(parsed)
  }
}

impl<'de> Deserialize<'de> for PackageId {
  fn deserialize<D: Deserializer<'de>>(deserializer: D) -> Result<PackageId, D::Error> {
    deserializer.deserialize_str(PackageIdVisitor)
  }
}

struct PackageIdVisitor;

impl<'de> Visitor<'de> for PackageIdVisitor {
  type Value = PackageId;

  fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
    formatter.write_str("a package id")
  }

  fn visit_str<E: serde::de::Error>(self, value: &str) -> Result<Self::Value, E> {
    value.parse::<PackageId>().map_err(serde::de::Error::custom)
  }
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct FunctionDefinitionId {
  package: PackageId,
  function: String
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct EditablePackage {
  id: PackageId,
  function_definitions: Vec<FunctionDefinition>
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct FunctionDefinition {
  name: String,
  argument_definitions: Vec<NameTypePair>,
  return_definitions: Vec<NameTypePair>,
  implementation: Vec<FunctionUse>,
  return_substitutions: Vec<Substitution>
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct NameTypePair {
  name: String,
  type_tag: TypeTag
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct FunctionUse {
  definition: FunctionDefinitionId,
  argument_substitutions: Vec<Substitution>
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct Substitution {
  target: String,
  with: SubstituteWith
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
#[serde(tag = "type")]
pub enum SubstituteWith {
  Argument {
    definition: FunctionDefinitionId,
    argument: String
  },
  Return {
    definition: FunctionDefinitionId,
    use_: i32,
    return_: String
  },
  Constant {
    type_tag: TypeTag,
    value: String
  }
}

pub type TypeTag = Vec<String>;
