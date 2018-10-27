#![feature(proc_macro_hygiene)]
pub mod stream;

#[compiler::inject]
mod compiled {
  pub mod builtin {
    pub mod add {
      pub struct Argument {
        pub operand1: i32,
        pub operand2: i32
      }

      pub struct Return {
        pub output: i32
      }

      pub fn call(argument: Argument) -> Return {
        Return {
          output: argument.operand1 + argument.operand2
        }
      }
    }
  }
}

fn main() {
  compiled::local::example::double(())
}
