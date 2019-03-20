#![feature(fnbox)]

use frappe::{Sink, Stream};
use frappe_dom::{initialize, mount, Element as El, EventsSink};
use maplit::hashmap;
use maybe_owned::MaybeOwned;
use petgraph::graph::{EdgeIndex, NodeIndex};
use petgraph::{Directed, Graph};
use std::ops::{Deref, DerefMut};
mod util;
use lazy_static::lazy_static;
use util::*;
use wasm_bindgen::prelude::*;
use web_sys::{window, MouseEvent};

lazy_static! {
  static ref ARGUMENTS_NODE_INDEX: NodeIndex = 1.into();
  static ref RETURNS_NODE_INDEX: NodeIndex = 0.into();
}

#[derive(Clone)]
enum RoughConnection {
  Between(NodeIndex, NodeIndex),
  // In case where connection ends is not yet decided
  Begin,
  // In case where connection begins is not yet decided
  End,
}

// 多引数/多返り値を持つ関数を扱う際は()が引数<->返り値のマップになる
#[derive(Clone)]
struct CallGraph(Graph<(), (), Directed>);

impl CallGraph {
  fn new() -> Self {
    let mut call_graph = Graph::new();
    call_graph.add_node(()); // returns
    call_graph.add_node(()); // arguments
    Self(call_graph)
  }
}

impl Deref for CallGraph {
  type Target = Graph<(), (), Directed>;

  fn deref(&self) -> &Self::Target {
    &self.0
  }
}

impl DerefMut for CallGraph {
  fn deref_mut(&mut self) -> &mut Graph<(), (), Directed> {
    &mut self.0
  }
}

fn function_overview(call_graph: Stream<CallGraph>) -> (Stream<El>, Stream<app::Action>) {
  let mut arguments = EventsSink::new();
  let mut returns = EventsSink::new();
  let focus_arguments = arguments
    .events("click")
    .map(|_: MaybeOwned<MouseEvent>| app::Action::Focus(app::Display::RoughConnection(RoughConnection::Begin)));
  let focus_returns = returns
    .events("click")
    .map(|_: MaybeOwned<MouseEvent>| app::Action::Focus(app::Display::RoughConnection(RoughConnection::End)));
  let action = focus_arguments.merge(&focus_returns);

  // TODO: call_graphを使って各GUI要素との繋がりを表示する
  let view = call_graph.map(move |_| {
    El::new("div").children(vec![
      El::new("div")
        .attrs(hashmap! {
          "style" => "margin-top: 1em; margin-bottom: auto; margin-left: 1em; border: black solid 1px;"
        })
        .sink(arguments.clone())
        .children(vec![function_definition_arguments(vec!["props".to_string()])]),
      El::new("div").attrs(hashmap! {
        "style" => "flex: 1;"
      }),
      El::new("div")
        .attrs(hashmap! {
          "style" => "margin-top: auto; margin-bottom: 1em; margin-right: 1em; border: black solid 1px;"
        })
        .sink(returns.clone())
        .children(vec![function_definition_returns(vec!["view".to_string()])]),
    ])
  });

  (view, action)
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
    }),
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

pub(crate) fn connection_detail(props: Stream<(CallGraph, RoughConnection)>) -> (Stream<El>, Stream<app::Action>) {
  let mut button = EventsSink::new();
  let fork_returns = button
    .events("click")
    .map(|_: MaybeOwned<MouseEvent>| app::Action::ForkArguments(*RETURNS_NODE_INDEX));

  let view = props.map(move |props| {
    let (call_graph, focus) = props.into_owned();
    match focus {
      RoughConnection::Begin => unimplemented!(),
      RoughConnection::End => El::new("div").children(vec![
        El::new("div").attrs(hashmap! {
          "style" => "margin-top: auto; margin-bottom: auto; border-top: cyan dashed 1px; flex: 1;"
        }),
        El::new("div")
          .attrs(hashmap! {
            "style" => "margin-top: auto; margin-bottom: auto; border: black solid 1px; position: relative;"
          })
          .children(vec![
            function_definition_returns(vec!["view".to_string()]),
            El::new("div")
              .attrs(hashmap! {
                "style" => "position: absolute; bottom: calc(-1px - 5px - 6px); left: calc(-1px - 5px - 6px);"
              })
              .children(vec![plus().sink(button.clone())]),
          ]),
        El::new("div").attrs(hashmap! {
          "style" => "flex: 1;"
        }),
      ]),
      RoughConnection::Between(_, _) => unimplemented!(),
    }
  });

  (view, fork_returns)
}

fn plus() -> El {
  El::new("div")
    .attrs(hashmap! {
      "style" => "position: relative; width: calc(13px + 10px); height: calc(13px + 10px); background-color: white;"
    })
    .children(vec![
      El::new("div").attrs(hashmap! {
        "style" => "
          position: absolute;
          border-top: black solid 1px;
          left: 5px;
          top: calc(5px + 6px);
          height: 0px;
          width: 13px;
        "
      }),
      El::new("div").attrs(hashmap! {
        "style" => "
          position: absolute;
          border-left: black solid 1px;
          left: calc(5px + 6px);
          top: 5px;
          height: 13px;
          width: 0px;
        "
      }),
    ])
}

mod app {
  use super::*;

  #[derive(Clone)]
  pub(crate) enum Display {
    Overview,
    RoughConnection(RoughConnection),
  }

  #[derive(Clone)]
  pub(crate) struct State {
    call_graph: CallGraph,
    display: Display,
  }

  impl State {
    fn new() -> Self {
      Self {
        call_graph: CallGraph::new(),
        display: Display::Overview,
      }
    }
  }

  #[derive(Clone)]
  pub(crate) enum Action {
    Focus(Display),
    ForkArguments(NodeIndex),
    ForkReturns(NodeIndex),
  }

  pub(crate) fn view() -> Stream<El> {
    let action_sink: Sink<Action> = Sink::new();
    let state = action_sink
      .stream()
      .scan(State::new(), |mut state, action| match action.into_owned() {
        Action::ForkArguments(function_call) => {
          let new_function_call = state.call_graph.add_node(());
          state.call_graph.add_edge(new_function_call, function_call, ());
          state
        }
        Action::Focus(display) => {
          state.display = display;
          state
        }
        Action::ForkReturns(_) => unimplemented!(),
      });
    let state = initialize(&state, State::new());

    let (overview_view, overview_action) = function_overview(state.filter_map(|state| match state.display {
      Display::Overview => Some(state.into_owned().call_graph),
      _ => None,
    }));

    let (detail_view, detail_action) = connection_detail(state.filter_map(|state| {
      let state = state.into_owned();
      match state.display {
        Display::RoughConnection(rough_connection) => Some((state.call_graph, rough_connection)),
        _ => None,
      }
    }));

    let action_stream = overview_action.merge(&detail_action);
    let view = depends(&overview_view.merge(&detail_view), &action_stream);
    imitate(action_sink, action_stream);
    view
  }
}

#[wasm_bindgen]
pub fn main() {
  let body = window().unwrap().document().unwrap().body().unwrap();
  mount(app::view(), body);
}
