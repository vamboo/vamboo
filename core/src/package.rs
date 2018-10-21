use std::fmt;
use std::str::FromStr;
use std::collections::HashMap;
use std::hash::{Hash, Hasher};

extern crate serde;
use serde::ser::{Serialize, Serializer};
use serde::de::{Deserialize, Deserializer, Visitor};

extern crate failure;
use failure::format_err;

extern crate uuid;
use uuid::Uuid;

extern crate petgraph;
use petgraph::Graph;
use petgraph::graph::NodeIndex;

extern crate serde_json;

#[derive(Debug, PartialEq, Eq, Clone, Hash)]
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

#[derive(Debug, PartialEq, Eq, Clone, Hash)]
pub struct FunctionDefinitionId {
  pub package: PackageId,
  pub function: String
}

impl fmt::Display for FunctionDefinitionId {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{}.{}", self.package, self.function)
  }
}

impl Serialize for FunctionDefinitionId {
  fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
    serializer.serialize_str(&format!("{}", self))
  }
}

impl FromStr for FunctionDefinitionId {
  type Err = failure::Error;

  fn from_str(s: &str) -> Result<Self, Self::Err> {
    let mut segments = s.rsplitn(2, ".");
    let mut next_segment = || segments.next().ok_or(
      format_err!("Invalid format in function definition id: {}", s)
    );

    let function = next_segment()?.to_string();
    let package = next_segment()?.parse::<PackageId>()?;

    Ok(FunctionDefinitionId { package, function })
  }
}

impl<'de> Deserialize<'de> for FunctionDefinitionId {
  fn deserialize<D: Deserializer<'de>>(deserializer: D) -> Result<FunctionDefinitionId, D::Error> {
    deserializer.deserialize_str(FunctionDefinitionIdVisitor)
  }
}

struct FunctionDefinitionIdVisitor;

impl<'de> Visitor<'de> for FunctionDefinitionIdVisitor {
  type Value = FunctionDefinitionId;

  fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
    formatter.write_str("a function definition id")
  }

  fn visit_str<E: serde::de::Error>(self, value: &str) -> Result<Self::Value, E> {
    value.parse::<Self::Value>().map_err(serde::de::Error::custom)
  }
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct SavedPackage {
  pub version: u32,
  pub package: EditablePackage
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct EditablePackage {
  pub id: PackageId,
  pub function_definitions: Vec<FunctionDefinition>
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct FunctionDefinition {
  pub name: String,
  pub argument_definitions: Vec<NameTypePair>,
  pub return_definitions: Vec<NameTypePair>,
  pub implementation: Vec<FunctionCall>,
  pub return_substitutions: Vec<Substitution>
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct NameTypePair {
  pub name: String,
  pub type_tag: TypeTag
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct FunctionCall {
  pub call: FunctionDefinitionId,
  pub argument_substitutions: Vec<Substitution>,
  pub id: Uuid
}

impl PartialEq for FunctionCall {
  fn eq(&self, other: &FunctionCall) -> bool {
    self.id == other.id
  }
}

impl Eq for FunctionCall {}

impl Hash for FunctionCall {
  fn hash<H: Hasher>(&self, state: &mut H) {
    for byte in self.id.as_bytes() {
      byte.hash(state);
    }
  }
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Clone)]
pub struct Substitution {
  pub substitute: String,
  #[serde(flatten)]
  pub with: SubstituteWith
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Clone)]
#[serde(untagged)]
pub enum SubstituteWith {
  Argument {
    with_argument: String,
    of_function: FunctionDefinitionId,
  },
  Return {
    with_return: String,
    of_call: Uuid,
    of_function: FunctionDefinitionId
  },
  Constant {
    with_value: String,
    of_type: TypeTag
  }
}

pub type TypeTag = Vec<String>;

#[cfg(test)]
mod tests {
  extern crate wasm_bindgen_test;
  use wasm_bindgen_test::*;

  use super::*;

  fn serialized() -> String {
    "
{
  \"version\": 1,
  \"package\": {
    \"id\": \"local.example\",
    \"function_definitions\": [
      {
        \"name\": \"double\",
        \"argument_definitions\": [
          {
            \"name\": \"input\",
            \"type_tag\": [\"number\"]
          }
        ],
        \"return_definitions\": [
          {
            \"name\": \"output\",
            \"type_tag\": [\"number\"]
          }
        ],
        \"implementation\": [
          {
            \"call\": \"builtin.add\",
            \"argument_substitutions\": [
              {
                \"substitute\": \"operand1\",
                \"with_argument\": \"input\",
                \"of_function\": \"local.example.double\"
              },
              {
                \"substitute\": \"operand2\",
                \"with_argument\": \"input\",
                \"of_function\": \"local.example.double\"
              }
            ],
            \"id\": \"44c3e426-f2a4-4f00-92b9-90e53d668c3a\"
          }
        ],
        \"return_substitutions\": [
          {
            \"substitute\": \"output\",
            \"with_return\": \"output\",
            \"of_call\": \"44c3e426-f2a4-4f00-92b9-90e53d668c3a\",
            \"of_function\": \"builtin.add\"
          }
        ]
      }
    ]
  }
}
    ".replace(" ", "").replace("\n", "")
  }

  fn deserialized() -> SavedPackage {
    SavedPackage {
      version: 1,
      package: EditablePackage {
        id: PackageId::Local {
          package: "example".to_string()
        },
        function_definitions: vec![
          FunctionDefinition {
            name: "double".to_string(),
            argument_definitions: vec![
              NameTypePair {
                name: "input".to_string(),
                type_tag: vec!["number".to_string()]
              }
            ],
            return_definitions: vec![
              NameTypePair {
                name: "output".to_string(),
                type_tag: vec!["number".to_string()]
              }
            ],
            implementation: vec![
              FunctionCall {
                call: FunctionDefinitionId {
                  package: PackageId::BuiltIn,
                  function: "add".to_string()
                },
                argument_substitutions: vec![
                  Substitution {
                    substitute: "operand1".to_string(),
                    with: SubstituteWith::Argument {
                      with_argument: "input".to_string(),
                      of_function: FunctionDefinitionId {
                        package: PackageId::Local {
                          package: "example".to_string()
                        },
                        function: "double".to_string()
                      }
                    }
                  },
                  Substitution {
                    substitute: "operand2".to_string(),
                    with: SubstituteWith::Argument {
                      with_argument: "input".to_string(),
                      of_function: FunctionDefinitionId {
                        package: PackageId::Local {
                          package: "example".to_string()
                        },
                        function: "double".to_string()
                      },
                    }
                  }
                ],
                id: Uuid::parse_str("44c3e426f2a44f0092b990e53d668c3a").unwrap()
              }
            ],
            return_substitutions: vec![
              Substitution {
                substitute: "output".to_string(),
                with: SubstituteWith::Return {
                  with_return: "output".to_string(),
                  of_call: Uuid::parse_str("44c3e426f2a44f0092b990e53d668c3a").unwrap(),
                  // This exists for readability for humans. Programs never use this.
                  of_function: FunctionDefinitionId {
                    package: PackageId::BuiltIn,
                    function: "add".to_string()
                  }
                }
              }
            ]
          }
        ]
      }
    }
  }

  #[wasm_bindgen_test]
  fn deserialize() {
    let expected = deserialized();
    let deserialized: SavedPackage = serde_json::from_str(&serialized()).unwrap();
    assert_eq!(expected, deserialized);
  }

  #[wasm_bindgen_test]
  fn serialize() {
    let expected = serialized();
    let serialized = serde_json::to_string(&deserialized()).unwrap();
    assert_eq!(expected, serialized);
  }
}

