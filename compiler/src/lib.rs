extern crate proc_macro;
use petgraph::algo::toposort;
use petgraph::graph::NodeIndex;
use petgraph::visit::EdgeRef;
use petgraph::Graph;
use proc_macro2::{Ident, Span, TokenStream};
use quote::{quote, ToTokens};
use std::collections::HashMap;
use uuid::Uuid;

#[proc_macro_attribute]
pub fn inject(
  _: proc_macro::TokenStream,
  input: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
  let item = syn::parse(input.clone()).expect("failed to parse");
  let builtin: TokenStream = match item {
    syn::Item::Mod(ref item) if item.ident.to_string().as_str() == "compiled" => {
      item
        .clone()
        .content
        .expect("there's no built-in functions")
        .1
    }
    _ => panic!("compiler::inject only can be applied to module named compiled"),
  }
  .into_iter()
  .map(|item| item.into_token_stream())
  .collect();

  let editable_package = open();
  let compiled_package = compile_package(&editable_package);

  let output = quote! {
    mod compiled {
      #builtin

      pub mod local {
        #compiled_package
      }
    }
  };

  println!("{}", output);

  output.into()
}

fn compile_package(editable_package: &core::EditablePackage) -> TokenStream {
  let package_ident = match editable_package.id.clone() {
    core::PackageId::Local { package } => Ident::new(&package, Span::call_site()),
    _ => panic!("compiling packages from the market is not supported for now"),
  };
  let function_modules: TokenStream = (0..editable_package.function_definitions.len())
    .map(|i| compile_function(get_function(&editable_package, i)))
    .collect();

  quote! {
    pub mod #package_ident {
      #function_modules
    }
  }
}

fn compile_function(function: Function) -> TokenStream {
  let calculation_graph = construct_calculation_graph(&function);
  let mut node_ids = toposort(&calculation_graph, None).expect("infinite recursion detected");

  let argument_struct_fields = compile_struct_definition_fields(function.argument_definitions);
  let return_struct_fields = compile_struct_definition_fields(function.return_definitions);

  let return_node_id = node_ids.drain(0..1).next().unwrap();
  let return_fields = compile_return_fields(&calculation_graph, return_node_id);

  node_ids.reverse();
  let call_tokens = compile_calls(&calculation_graph, node_ids);

  let function_ident = Ident::new(&function.id.function, Span::call_site());

  (quote! {
    pub mod #function_ident {
      pub struct Argument {
        #argument_struct_fields
      }

      pub struct Return {
        #return_struct_fields
      }

      pub fn call(argument: Argument) -> Return {
        #call_tokens

        Return {
          #return_fields
        }
      }
    }
  })
  .into()
}

fn compile_struct_definition_fields(target: Vec<core::NameTypePair>) -> TokenStream {
  target
    .into_iter()
    .map(|name_type| {
      let name_ident = Ident::new(&name_type.name, Span::call_site());

      quote! {
        pub #name_ident: i32
      }
    })
    .collect()
}

fn compile_return_fields(
  calculation_graph: &Graph<CalculationGraphNode, CalculationGraphEdge>,
  return_node_id: NodeIndex,
) -> TokenStream {
  calculation_graph
    .edges(return_node_id)
    .map(|edge| -> TokenStream {
      // I don't know why & is needed here
      let dst_return_name = &edge.weight().substitute;
      let dst_return_ident = Ident::new(&dst_return_name, Span::call_site());

      let call_name = format!("call{}", &edge.target().index());
      let call_ident = Ident::new(&call_name, Span::call_site());

      let src_return_name = &edge.weight().with;
      let src_return_ident = Ident::new(&src_return_name, Span::call_site());

      (quote! {
        #dst_return_ident: #call_ident.#src_return_ident,
      })
    })
    .collect()
}

fn compile_calls(
  calculation_graph: &Graph<CalculationGraphNode, CalculationGraphEdge>,
  node_ids: Vec<NodeIndex>,
) -> TokenStream {
  node_ids
    .into_iter()
    .map(|node_id| -> TokenStream {
      match calculation_graph.node_weight(node_id).unwrap() {
        CalculationGraphNode::Call(function_definition_id) => {
          let function_ident: TokenStream = vec![
            compile_module_specifier(function_definition_id),
            quote!(::call),
          ]
          .into_iter()
          .collect();

          let result_name = format!("call{}", node_id.index());
          let result_ident = Ident::new(&result_name, Span::call_site());

          let argument = compile_argument(function_definition_id, &calculation_graph, node_id);

          quote! {
            let #result_ident = #function_ident(#argument);
          }
        }
        CalculationGraphNode::Argument => quote! {},
        CalculationGraphNode::Return => panic!("toposort went wrong"),
      }
    })
    .collect()
}

fn compile_argument(
  function_definition_id: &core::FunctionDefinitionId,
  calculation_graph: &Graph<CalculationGraphNode, CalculationGraphEdge>,
  node_id: NodeIndex,
) -> TokenStream {
  let argument_struct_ident: TokenStream = vec![
    compile_module_specifier(function_definition_id),
    quote!(::Argument),
  ]
  .into_iter()
  .collect();

  let argument_struct_fields: TokenStream = calculation_graph
    .edges(node_id)
    .map(|edge| -> TokenStream {
      // TODO: Better naming
      let substitution_ident = match calculation_graph.node_weight(edge.target()).unwrap() {
        CalculationGraphNode::Argument => Ident::new("argument", Span::call_site()),
        CalculationGraphNode::Call(_) => {
          // TODO: DRY
          let substitution_name = format!("call{}", edge.target().index());
          Ident::new(&substitution_name, Span::call_site())
        }
        CalculationGraphNode::Return => panic!(),
      };

      let argument_name = &edge.weight().substitute;
      let argument_ident = Ident::new(&argument_name, Span::call_site());

      let substitute_with = &edge.weight().with;
      let substitute_with_ident = Ident::new(&substitute_with, Span::call_site());

      (quote! {
        #argument_ident: #substitution_ident.#substitute_with_ident,
      })
    })
    .collect();

  (quote! {
    #argument_struct_ident {
      #argument_struct_fields
    }
  })
  .into()
}

fn compile_module_specifier(function_definition_id: &core::FunctionDefinitionId) -> TokenStream {
  std::iter::once(quote!(crate::compiled))
    .chain(
      function_definition_id
        .to_string()
        .split(".")
        .map(|segment| {
          let segment_ident = Ident::new(segment, Span::call_site());
          quote! {
            ::#segment_ident
          }
        }),
    )
    .collect()
}

fn open() -> core::EditablePackage {
  let path =
    std::env::var("VAMBOO_COMPILATION_TARGET").expect("$VAMBOO_COMPILATION_TARGET not set");
  let contents =
    std::fs::read_to_string(path).expect("$VAMBOO_COMPILATION_TARGET could not be read");
  let deserialized: core::SavedPackage =
    serde_json::from_str(&contents).expect("$VAMBOO_COMPILATION_TARGET is not valid JSON");

  deserialized.package
}

struct CalculationGraphEdge {
  substitute: String,
  with: String,
}

#[derive(PartialEq, Eq, Hash, Clone, Debug)]
enum CalculationGraphNode {
  Argument,
  Return,
  Call(core::FunctionDefinitionId), // TODO: Constant()
}

fn construct_calculation_graph(
  function: &Function,
) -> Graph<CalculationGraphNode, CalculationGraphEdge> {
  let mut call_node_ids: HashMap<Uuid, NodeIndex> = HashMap::new();
  let mut calculation_graph = Graph::new();

  let argument_node_id = calculation_graph.add_node(CalculationGraphNode::Argument);
  let return_node_id = calculation_graph.add_node(CalculationGraphNode::Return);

  for call in function.implementation.iter().cloned() {
    let node_id = calculation_graph.add_node(CalculationGraphNode::Call(call.call));
    call_node_ids.insert(call.id, node_id);
  }

  for substitution in function.return_substitutions.iter().cloned() {
    match substitution.with {
      core::SubstituteWith::Argument {
        with_argument,
        of_function: _,
      } => {
        calculation_graph.add_edge(
          return_node_id,
          argument_node_id,
          CalculationGraphEdge {
            substitute: substitution.substitute,
            with: with_argument,
          },
        );
      }
      core::SubstituteWith::Return {
        with_return,
        of_call,
        of_function: _,
      } => {
        let dependency_id = call_node_ids.get(&of_call).unwrap();
        calculation_graph.add_edge(
          return_node_id,
          *dependency_id,
          CalculationGraphEdge {
            substitute: substitution.substitute,
            with: with_return,
          },
        );
      }
      core::SubstituteWith::Constant {
        with_value: _,
        of_type: _,
      } => unimplemented!(),
    }
  }

  for call in function.implementation.iter().cloned() {
    for substitution in call.argument_substitutions {
      let node_id = call_node_ids.get(&call.id).unwrap();

      match substitution.with {
        core::SubstituteWith::Argument {
          with_argument,
          of_function: _,
        } => {
          calculation_graph.add_edge(
            *node_id,
            argument_node_id,
            CalculationGraphEdge {
              substitute: substitution.substitute,
              with: with_argument,
            },
          );
        }
        core::SubstituteWith::Return {
          with_return,
          of_call,
          of_function: _,
        } => {
          let dependency_id = call_node_ids.get(&of_call).unwrap();
          calculation_graph.add_edge(
            *node_id,
            *dependency_id,
            CalculationGraphEdge {
              substitute: substitution.substitute,
              with: with_return,
            },
          );
        }
        core::SubstituteWith::Constant {
          with_value: _,
          of_type: _,
        } => unimplemented!(),
      };
    }
  }

  calculation_graph
}

struct Function {
  id: core::FunctionDefinitionId,
  argument_definitions: Vec<core::NameTypePair>,
  return_definitions: Vec<core::NameTypePair>,
  implementation: Vec<core::FunctionCall>,
  return_substitutions: Vec<core::Substitution>,
}

fn get_function(editable_package: &core::EditablePackage, index: usize) -> Function {
  let function_definition: core::FunctionDefinition =
    (&editable_package.function_definitions[index]).clone();
  Function {
    id: core::FunctionDefinitionId {
      package: editable_package.id.clone(),
      function: function_definition.name,
    },
    argument_definitions: function_definition.argument_definitions,
    return_definitions: function_definition.return_definitions,
    implementation: function_definition.implementation,
    return_substitutions: function_definition.return_substitutions,
  }
}
