#![feature(fnbox)]

use bumpalo::Bump;
use dodrio::builder::*;
use dodrio::{Node, Render, Vdom};
use lazy_static::lazy_static;
use petgraph::graph::NodeIndex;
use petgraph::{Directed, Graph};
use std::ops::{Deref, DerefMut};
use wasm_bindgen::prelude::*;
use web_sys::window;

lazy_static! {
  static ref ARGUMENTS_NODE_INDEX: NodeIndex = 1.into();
  static ref RETURNS_NODE_INDEX: NodeIndex = 0.into();
}

thread_local! {
  static VDOM: Vdom = {
    let body = window().unwrap().document().unwrap().body().unwrap();
    Vdom::new(&body, App::new())
  }
}

fn render() {
  VDOM.with(|vdom| vdom.weak().schedule_render());
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

#[derive(Clone)]
pub(crate) enum Display {
  Overview,
  RoughConnection(RoughConnection),
}

#[derive(Clone)]
pub(crate) struct App {
  call_graph: CallGraph,
  display: Display,
}

impl App {
  fn new() -> Self {
    Self {
      call_graph: CallGraph::new(),
      display: Display::Overview,
    }
  }

  fn display(&mut self, x: Display) {
    self.display = x;
    render();
  }

  fn fork_arguments(&mut self, node_id: NodeIndex) {}

  fn fork_returns(&mut self, node_id: NodeIndex) {}
}

impl Render for App {
  fn render<'a: 'bump, 'bump>(&'a self, bump: &'bump Bump) -> Node<'bump> {
    match self.display.clone() {
      Display::Overview => function_overview(bump),
      Display::RoughConnection(rough_connection) => div(bump).children([text("TODO")]).finish(),
    }
  }
}

#[rustfmt::skip]
fn function_overview<'bump>(bump: &'bump Bump) -> Node<'bump> {
  div(bump)
  .children([
    div(bump)
    .attr("style", "
margin-top: 1em;
margin-bottom: auto;
margin-left: 1em;
border: black solid 1px;")
    .on("click", |app, _, _| app.unwrap_mut::<App>().display(Display::RoughConnection(RoughConnection::Begin)))
    .children([function_definition_arguments(bump, "props")])
    .finish(),
    div(bump)
    .attr("style", "flex: 1;")
    .finish(),
    div(bump)
    .attr("style", "
margin-top: auto;
margin-bottom: 1em;
margin-right: 1em;
border: black solid 1px;")
    .on("click", |app, _, _| app.unwrap_mut::<App>().display(Display::RoughConnection(RoughConnection::End)))
    .children([function_definition_returns(bump, "view")])
    .finish()
  ])
  .finish()
}

#[rustfmt::skip]
fn function_definition_arguments<'a: 'bump, 'bump>(bump: &'bump Bump, arg: &'static str) -> Node<'bump> {
  div(bump)
  .attr("style", "
margin-top: 1em;
margin-bottom: 1em;
margin-left: 0.9em;
margin-right: -0.5em;
background-color: white;")
  .children([connection_stamen(bump, arg)])
  .finish()
}

#[rustfmt::skip]
fn function_definition_returns<'bump>(bump: &'bump Bump, ret: &'static str) -> Node<'bump> {
  div(bump)
  .attr("style", "
margin-top: 1em;
margin-bottom: 1em;
margin-left: -0.5em;
margin-right: 0.9em;
background-color: white;")
  .children([connection_pistil(bump, ret)])
  .finish()
}

#[rustfmt::skip]
fn connection_stamen<'bump>(bump: &'bump Bump, arg: &'bump str) -> Node<'bump> {
  div(bump)
  .children([
    text(arg),
    div(bump)
    .attr("style", "
width: 1em;
height: 0px;
border-top: black solid 1px;
margin-top: 0.5em;
margin-left: 0.5em;")
    .finish()
  ])
  .finish()
}

#[rustfmt::skip]
fn connection_pistil<'bump>(bump: &'bump Bump, ret: &'bump str) -> Node<'bump> {
  div(bump)
  .children([
    div(bump)
    .attr("style", "
width: 1em;
height: 0px;
border-top: black solid 1px;
margin-top: 0.5em;
margin-right: 0.5em;")
    .finish(),
    text(ret)
  ])
  .finish()
}

#[wasm_bindgen]
pub fn main() {
  // The first call of with initializes VDOM.
  VDOM.with(|_| {});
}
