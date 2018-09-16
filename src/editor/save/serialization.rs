extern crate serde;
extern crate serde_json;

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
#[serde(tag = "type")]
pub enum PackageId {
  BuiltIn,
  Local {
    package: String
  },
  Market {
    user: String,
    package: String
  },
  Git {
    url: String
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
