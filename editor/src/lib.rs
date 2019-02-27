use wasm_bindgen::prelude::*;
use web_sys::window;

#[wasm_bindgen]
pub fn main() {
  window().unwrap().document().unwrap().body().unwrap().set_inner_html("hell yeah");
}
