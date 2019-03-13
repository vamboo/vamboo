use frappe::{Sink, Stream};
use frappe_dom::{initialize, mount, Element as El};
use maplit::hashmap;
use wasm_bindgen::prelude::*;
use web_sys::window;

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

fn overview(main: Stream<Main>) -> Stream<El> {
    main.map(move |main| {
    El::new("div")
      .attrs(hashmap! {
        "style" => "margin: auto;"
      })
      .children(vec!["main".into()])
  })
}
//fn function_detail(function: Stream<Function>) -> Stream<El> {
//  !
//}

fn app() -> Stream<El> {
  let empty = Sink::new();
  let main = initialize(&empty.stream(), Main { argument: None });
  let overview = overview(main);

  overview.map(move |overview| {
    El::new("div")
      .attrs(hashmap! {
        "style" => "display: flex;"
      })
      .children(vec![overview.into_owned()])
  })
}

#[wasm_bindgen]
pub fn main() {
  let body = window().unwrap().document().unwrap().body().unwrap();
  mount(app(), body);
}
