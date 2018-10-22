#![feature(proc_macro_hygiene)]
extern crate compiler;

pub mod stream;

#[compiler::inject]
mod executable_package {}

fn main() {
  executable_package::double(())
}
