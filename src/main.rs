#[macro_use]
extern crate stdweb;
#[macro_use]
extern crate serde_derive;
use std::fs::File;
use std::io::prelude::*;

mod runtime;
use self::runtime::stream;
mod editor;
use self::editor::save::serialization::EditablePackage;

fn main() -> std::io::Result<()> {
  let mut file = File::open("examples/package.json")?;
  let mut contents = String::new();
  file.read_to_string(&mut contents)?;
  let deserialized: EditablePackage = serde_json::from_str(&contents).unwrap();
  println!("{:?}", deserialized);
  Ok(())
}
