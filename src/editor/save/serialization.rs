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

#[derive(Debug, PartialEq, Eq)]
pub struct FunctionDefinitionId {
  package: PackageId,
  function: String
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

#[cfg(test)]
mod tests {
  use super::*;

  fn serialized() -> String {
    "
{
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
          \"definition\": \"builtin.add\",
          \"argument_substitutions\": [
            {
              \"target\": \"operand1\",
              \"with\": {
                \"type\": \"Argument\",
                \"definition\": \"local.example.double\",
                \"argument\": \"input\"
              }
            },
            {
              \"target\": \"operand2\",
              \"with\": {
                \"type\": \"Argument\",
                \"definition\": \"local.example.double\",
                \"argument\": \"input\"
              }
            }
          ]
        }
      ],
      \"return_substitutions\": [
        {
          \"target\": \"output\",
          \"with\": {
            \"type\": \"Return\",
            \"definition\": \"local.example.double\",
            \"use_\": 0,
            \"return_\": \"output\"
          }
        }
      ]
    }
  ]
}
    ".replace(" ", "").replace("\n", "")
  }

  fn deserialized() -> EditablePackage {
    EditablePackage {
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
            FunctionUse {
              definition: FunctionDefinitionId {
                package: PackageId::BuiltIn,
                function: "add".to_string()
              },
              argument_substitutions: vec![
                Substitution {
                  target: "operand1".to_string(),
                  with: SubstituteWith::Argument {
                    definition: FunctionDefinitionId {
                      package: PackageId::Local {
                        package: "example".to_string()
                      },
                      function: "double".to_string()
                    },
                    argument: "input".to_string()
                  }
                },
                Substitution {
                  target: "operand2".to_string(),
                  with: SubstituteWith::Argument {
                    definition: FunctionDefinitionId {
                      package: PackageId::Local {
                        package: "example".to_string()
                      },
                      function: "double".to_string()
                    },
                    argument: "input".to_string()
                  }
                }
              ]
            }
          ],
          return_substitutions: vec![
            Substitution {
              target: "output".to_string(),
              with: SubstituteWith::Return {
                definition: FunctionDefinitionId {
                  package: PackageId::Local {
                    package: "example".to_string()
                  },
                  function: "double".to_string()
                },
                use_: 0,
                return_: "output".to_string()
              }
            }
          ]
        }
      ]
    }
  }

  #[test]
  fn deserialize() {
    let expected = deserialized();
    let deserialized: EditablePackage = serde_json::from_str(&serialized()).unwrap();
    assert_eq!(expected, deserialized);
  }

  #[test]
  fn serialize() {
    let expected = serialized();
    let serialized = serde_json::to_string(&deserialized()).unwrap();
    assert_eq!(expected, serialized);
  }
}

