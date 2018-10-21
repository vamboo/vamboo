use std::hash::{Hash, Hasher};
use std::collections::hash_map::DefaultHasher;
use std::collections::HashMap;

extern crate proc_macro;

extern crate proc_macro2;
use proc_macro2::{TokenStream, Ident, Span};

extern crate syn;
#[macro_use] extern crate quote;

extern crate uuid;
use uuid::Uuid;

extern crate petgraph;
use petgraph::Graph;
use petgraph::graph::NodeIndex;
use petgraph::algo::toposort;

extern crate serde_json;

extern crate core;

#[proc_macro_attribute]
pub fn inject(_: proc_macro::TokenStream, input: proc_macro::TokenStream) -> proc_macro::TokenStream {
  let item = syn::parse(input.clone()).expect("failed to parse");

  let mod_ident = match item {
    syn::Item::Mod(item) => item.ident,
    _ => panic!("expects struct")
  };

  let editable_package = open();
  let tokens = compile(editable_package);

  let output = quote! {
    mod #mod_ident {
      pub fn main() {
        #tokens
      }
    }
  };

  println!("{}", output);

  output.into()
}

fn compile(mut editable_package: core::EditablePackage) -> TokenStream {
  let main = editable_package.function_definitions.pop().unwrap();
  let calculation_graph = construct_calculation_graph(main);
  let mut node_ids = toposort(&calculation_graph, None).expect("infinite recursion detected");

  let return_node_id = node_ids.drain(0..1).next().unwrap();
  let return_node = calculation_graph.node_weight(return_node_id).unwrap();

  let tokens: TokenStream = node_ids.into_iter().rev().map(|node_id| {
    match calculation_graph.node_weight(node_id).unwrap() {
      CalculationGraphNode::Call(function_definition_id) => {
        let mut hasher = DefaultHasher::new();
        function_definition_id.hash(&mut hasher);
        let function_name = format!("function{}", hasher.finish());
        let function_ident = Ident::new(&function_name, Span::call_site());;

        let result_name = format!("call{}", node_id.index());
        let result_ident = Ident::new(&result_name, Span::call_site());

        quote! {
          let #result_ident = #function_ident();
        }
      },
      CalculationGraphNode::Argument => quote!{},
      CalculationGraphNode::Return => panic!("toposort went wrong")
    }.into()
  }).fold(String::new(), |acc, tokens: TokenStream| format!("{}{}", acc, tokens)).parse().unwrap();

  tokens
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

#[derive(PartialEq, Eq, Hash, Clone, Debug)]
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
