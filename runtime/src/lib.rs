extern crate compiler;

pub mod stream;

#[compiler::inject]
struct ExecutablePackage {}

fn hoge() -> ExecutablePackage {
  ExecutablePackage::new()
}
