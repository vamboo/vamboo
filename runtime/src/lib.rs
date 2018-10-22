#![feature(proc_macro_hygiene)]
pub mod stream;

#[compiler::inject]
mod compiled {}

fn main() {
  compiled::double(())
}
