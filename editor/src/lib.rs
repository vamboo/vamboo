use frappe::{Sink, Stream};
use frappe_dom::{initialize, mount, Element as El, EventsSink};
use maplit::hashmap;
use maybe_owned::MaybeOwned;
use petgraph::graph::{EdgeIndex, NodeIndex};
use petgraph::{Directed, Graph};
use std::ops::Deref;
use wasm_bindgen::prelude::*;
use web_sys::{window, MouseEvent};

#[derive(Clone)]
struct Function {
  name: String,
  argument: Box<Option<Function>>,
  returning: Box<Option<Function>>,
}

#[derive(Clone)]
struct Main {
  argument: Option<Function>,
}

// 多引数/多返り値を持つ関数を扱う際は()が引数<->返り値のマップになる
#[derive(Clone)]
struct CallGraph(Graph<String, (), Directed>);

impl CallGraph {
  fn new() -> Self {
    let mut call_graph = Graph::new();
    call_graph.add_node("main".to_string());
    Self(call_graph)
  }
}

impl Deref for CallGraph {
  type Target = Graph<String, (), Directed>;

  fn deref(&self) -> &Self::Target {
    &self.0
  }
}

mod function_overview {
  use super::*;

  pub enum Msg {
    FocusConnection(EdgeIndex),
    FocusFunction(NodeIndex),
    FocusArguments,
    FocusReturns,
  }

  // call_graphがStreamである必要はないが、frappeがflatMapを持っていないので仕方なくStreamになっている
  // TODO: frappeにflatMapを追加するPRを出す
  // switchMapだったら所有権の問題もクリアできそう？
  pub(super) fn view(call_graph: Stream<CallGraph>) -> (Stream<El>, Stream<Msg>) {
    let mut returns = EventsSink::new();
    let msg = returns
      .events("click")
      .map(|_: MaybeOwned<MouseEvent>| Msg::FocusReturns);

    // TODO: call_graphを使って各GUI要素との繋がりを表示する
    let view = call_graph.map(move |_| {
      El::new("div")
        .children(vec![
          El::new("div")
            .attrs(hashmap! {
              "style" => "margin-top: 1em; margin-bottom: auto; margin-left: 1em; border: black solid 1px;"
            })
            .children(vec![
              function_definition_arguments(vec!["props".to_string()])
            ]),
          El::new("div").attrs(hashmap! {
            "style" => "flex: 1;"
          }),
          El::new("div")
            .attrs(hashmap! {
              "style" => "margin-top: auto; margin-bottom: 1em; margin-right: 1em; border: black solid 1px;"
            })
            .sink(returns.clone())
            .children(vec![
              function_definition_returns(vec!["view".to_string()])
            ]),
        ])
    });

    (view, msg)
  }
}

fn function_definition_arguments(arguments: Vec<String>) -> El {
  El::new("div")
    .attrs(hashmap! {
      "style" => "
        margin-top: 1em;
        margin-bottom: 1em;
        margin-left: 0.9em;
        margin-right: -0.5em;
        background-color: white;
      "
    })
    .children(arguments.iter().map(|arg| connection_stamen(arg)).collect())
}

fn function_definition_returns(returns: Vec<String>) -> El {
  El::new("div")
    .attrs(hashmap! {
      "style" => "
          margin-top: 1em;
          margin-bottom: 1em;
          margin-left: -0.5em;
          margin-right: 0.9em;
          background-color: white;
        "
    })
    .children(returns.iter().map(|ret| connection_pistil(ret)).collect())
}

fn connection_stamen(arg: &str) -> El {
  El::new("div").children(vec![
    arg.into(),
    El::new("div").attrs(hashmap! {
      "style" => "width: 1em; height: 0px; border-top: black solid 1px; margin-top: 0.5em; margin-left: 0.5em;"
    })
  ])
}

fn connection_pistil(ret: &str) -> El {
  El::new("div").children(vec![
    El::new("div").attrs(hashmap! {
      "style" => "width: 1em; height: 0px; border-top: black solid 1px; margin-top: 0.5em; margin-right: 0.5em;"
    }),
    ret.into(),
  ])
}

// fn function_detail(function: Stream<Function>) -> Stream<El> {
//   !
// }

fn app() -> Stream<El> {
  let mut call_graph = CallGraph::new();
  let call_graph_stream = initialize(&Sink::new().stream(), call_graph);
  let (overview_view, overview_msg) = function_overview::view(call_graph_stream);

  overview_view
}

#[wasm_bindgen]
pub fn main() {
  let body = window().unwrap().document().unwrap().body().unwrap();
  mount(app(), body);
}
