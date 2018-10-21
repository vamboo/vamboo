extern crate proc_macro;
use crate::proc_macro::TokenStream;

use std::collections::{hash_map, HashMap};

extern crate syn;
#[macro_use] extern crate quote;

extern crate uuid;
use uuid::Uuid;

extern crate petgraph;
use petgraph::Graph;
use petgraph::graph::NodeIndex;

extern crate core;

extern crate serde_json;

#[proc_macro_attribute]
pub fn inject(_: TokenStream, input: TokenStream) -> TokenStream {
  let item = syn::parse(input.clone()).expect("failed to parse");

  let struct_name = match item {
    syn::Item::Struct(struct_item) => struct_item.ident,
    _ => panic!("expects struct")
  };

  let output = quote! {
    impl #struct_name {
      fn new() -> #struct_name {
        #struct_name {}
      }
    }
  };

  format!("{}{}", input, output).parse().unwrap()
}

fn open() -> core::EditablePackage {
  let path = std::env::var("VAMBOO_COMPILATION_TARGET").expect("$VAMBOO_COMPILATION_TARGET not set");
  let contents = std::fs::read_to_string(path).expect("$VAMBOO_COMPILATION_TARGET could not be read");
  let deserialized: core::SavedPackage =
    serde_json::from_str(&contents).expect("$VAMBOO_COMPILATION_TARGET is not valid JSON");

  deserialized.package
}

struct CalculationGraphEdge {
  substitute: String,
  with: String
}

#[derive(PartialEq, Eq, Hash, Clone)]
enum CalculationGraphNode {
  Argument,
  Return,
  Call(core::FunctionDefinitionId)
  // TODO: Constant()
}

fn construct_calculation_graph(definition: core::FunctionDefinition)
-> Graph<CalculationGraphNode, CalculationGraphEdge> {
  let mut call_node_ids: HashMap<Uuid, NodeIndex> = HashMap::new();
  let mut calculation_graph = Graph::new();

  let argument_node_id = calculation_graph.add_node(CalculationGraphNode::Argument);
  let return_node_id = calculation_graph.add_node(CalculationGraphNode::Return);

  for call in definition.implementation.iter().cloned() {
    let node_id = calculation_graph.add_node(CalculationGraphNode::Call(call.call));
    call_node_ids.insert(call.id, node_id);
  }

  for substitution in definition.return_substitutions {
    match substitution.with {
      core::SubstituteWith::Argument { with_argument, of_function: _ } => {
        calculation_graph.add_edge(return_node_id, argument_node_id, CalculationGraphEdge {
          substitute: substitution.substitute,
          with: with_argument
        });
      },
      core::SubstituteWith::Return { with_return, of_call, of_function: _ } => {
        let dependency_id = call_node_ids.get(&of_call).unwrap();
        calculation_graph.add_edge(return_node_id, *dependency_id, CalculationGraphEdge {
          substitute: substitution.substitute,
          with: with_return
        });
      },
      core::SubstituteWith::Constant { with_value: _, of_type: _ } => unimplemented!()
    }
  }

  for call in definition.implementation {
    for substitution in call.argument_substitutions {
      let node_id = call_node_ids.get(&call.id).unwrap();

      match substitution.with {
        core::SubstituteWith::Argument { with_argument, of_function: _ } => {
          calculation_graph.add_edge(*node_id, argument_node_id, CalculationGraphEdge {
            substitute: substitution.substitute,
            with: with_argument
          });
        },
        core::SubstituteWith::Return { with_return, of_call, of_function: _ } => {
          let dependency_id = call_node_ids.get(&of_call).unwrap();
          calculation_graph.add_edge(*node_id, *dependency_id, CalculationGraphEdge {
            substitute: substitution.substitute,
            with: with_return
          });
        },
        core::SubstituteWith::Constant { with_value: _, of_type: _ } => unimplemented!()
      };
    }
  }

  calculation_graph
}

//impl From<core::FunctionDefinition> for Graph<CalculationGraphNode, ()> {
//  fn from(definition: core::FunctionDefinition) -> Self {
//    let mut node_ids: HashMap<Uuid, NodeIndex> = HashMap::new();
//    let mut calculation_graph = Graph::new();
//
//    for call in definition.implementation.iter() {
//      let node_id = calculation_graph.add_node(call.clone());
//      node_ids.insert(call.id, node_id);
//    }
//
//    for call in definition.implementation {
//      for substitution in call.argument_substitutions {
//        match substitution.with {
//          core::SubstituteWith::Argument { of_function, with_argument: _ } => {
//            assert_eq!(call.call, of_function);
//
//
//          },
//          core::SubstituteWith::Return { of_call, with_return: _, of_function: _ } => {
//            let node_id = node_ids.get(&call.id).unwrap();
//            let depends_on = node_ids.get(&of_call).unwrap();
//            calculation_graph.add_edge(*node_id, *depends_on, ());
//          },
//          _ => unimplemented!()
//        }
//      }
//    }
//
//    calculation_graph
//  }
// }
