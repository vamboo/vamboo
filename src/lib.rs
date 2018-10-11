#![feature(int_to_from_bytes)]
#[macro_use]
extern crate serde_derive;
use std::fs::File;
use std::io::prelude::*;

mod runtime;
use self::runtime::stream;
use self::runtime::vm;
mod editor;
use self::editor::save::serialization::PackageId;
extern crate serde_json;


fn main() {
  let package_id = PackageId::BuiltIn;
  let serialized = serde_json::to_string(&package_id).unwrap();
  println!("{}", serialized);
}
