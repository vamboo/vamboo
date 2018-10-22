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
use petgraph::visit::EdgeRef;

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
  let functions = compile(&editable_package);

  let output = quote! {
    mod #mod_ident {
      #functions
    }
  };

  println!("{}", output);

  output.into()
}

fn compile(editable_package: &core::EditablePackage) -> TokenStream {
  editable_package.function_definitions.iter().enumerate().map(|(index, _)| {
    compile_function(editable_package, index)
  }).fold(String::new(), |acc, tokens| format!("{}{}", acc, tokens)).parse().unwrap()
}

fn compile_function(editable_package: &core::EditablePackage, index: usize) -> TokenStream {
  let function = &editable_package.function_definitions[index];
  let calculation_graph = construct_calculation_graph(function);
  let mut node_ids = toposort(&calculation_graph, None).expect("infinite recursion detected");

  let return_node_id = node_ids.drain(0..1).next().unwrap();
  let return_tokens = compile_return(function, &calculation_graph, return_node_id);

  node_ids.reverse();
  let call_tokens = compile_calls(&calculation_graph, node_ids);

  let function_ident = Ident::new(&function.name, Span::call_site());

  (quote! {
    pub fn #function_ident(argument: ()) -> () {
      #call_tokens
      #return_tokens
    }
  }).into()
}

fn compile_return(
  function: &core::FunctionDefinition,
  calculation_graph: &Graph<CalculationGraphNode, CalculationGraphEdge>,
  return_node_id: NodeIndex
) -> TokenStream {
  let fields: TokenStream = calculation_graph.edges(return_node_id).map(|edge| {
    // I don't know why & is needed here
    let dst_return_name = &edge.weight().substitute;
    let dst_return_ident = Ident::new(&dst_return_name, Span::call_site());

    let call_name = format!("call{}", &edge.target().index());
    let call_ident = Ident::new(&call_name, Span::call_site());

    let src_return_name = &edge.weight().with;
    let src_return_ident = Ident::new(&src_return_name, Span::call_site());

    (quote! {
      #dst_return_ident: #call_ident.#src_return_ident,
    }).into()
  }).fold(String::new(), |acc, tokens: TokenStream| format!("{}{}", acc, tokens)).parse().unwrap();

  let return_struct_name = format!("Return_{}", function.name);
  let return_struct_ident = Ident::new(&return_struct_name, Span::call_site());

  (quote! {
    #return_struct_ident {
      #fields
    }
  }).into()
}

fn compile_calls(
  calculation_graph: &Graph<CalculationGraphNode, CalculationGraphEdge>,
  node_ids: Vec<NodeIndex>
) -> TokenStream {
  node_ids.into_iter().map(|node_id| {
    match calculation_graph.node_weight(node_id).unwrap() {
      CalculationGraphNode::Call(function_definition_id) => {
        let function_name = format!("{}", function_definition_id.function);
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
  }).fold(String::new(), |acc, tokens: TokenStream| format!("{}{}", acc, tokens)).parse().unwrap()
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

fn construct_calculation_graph(definition: &core::FunctionDefinition)
-> Graph<CalculationGraphNode, CalculationGraphEdge> {
  let mut call_node_ids: HashMap<Uuid, NodeIndex> = HashMap::new();
  let mut calculation_graph = Graph::new();

  let argument_node_id = calculation_graph.add_node(CalculationGraphNode::Argument);
  let return_node_id = calculation_graph.add_node(CalculationGraphNode::Return);

  for call in definition.implementation.iter().cloned() {
    let node_id = calculation_graph.add_node(CalculationGraphNode::Call(call.call));
    call_node_ids.insert(call.id, node_id);
  }

  for substitution in definition.return_substitutions.iter().cloned() {
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

  for call in definition.implementation.iter().cloned() {
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
