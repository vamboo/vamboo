#![feature(proc_macro_hygiene)]
extern crate compiler;

pub mod stream;

#[compiler::inject]
mod compiled {}

fn main() {
  compiled::double(())
}
