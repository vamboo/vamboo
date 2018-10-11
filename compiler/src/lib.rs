extern crate proc_macro;
use crate::proc_macro::TokenStream;

extern crate syn;
#[macro_use] extern crate quote;

extern crate core;
use core::package::{EditablePackage, SavedPackage};

extern crate serde_json;

#[proc_macro_attribute]
pub fn inject(_: TokenStream, input: TokenStream) -> TokenStream {
  let item = syn::parse(input.clone()).expect("failed to parse");

  let struct_name = match item {
    syn::Item::Struct(struct_item) => struct_item.ident,
    _ => panic!("expects struct")
  };

  let output = quote! {
    impl #struct_name {
      fn new() -> #struct_name {
        #struct_name {}
      }
    }
  };

  format!("{}{}", input, output).parse().unwrap()
}

fn open() -> EditablePackage {
  let path = std::env::var("VAMBOO_COMPILATION_TARGET").expect("$VAMBOO_COMPILATION_TARGET not set");
  let contents = std::fs::read_to_string(path).expect("$VAMBOO_COMPILATION_TARGET could not be read");
  let deserialized: SavedPackage = serde_json::from_str(&contents).expect("$VAMBOO_COMPILATION_TARGET is not valid JSON");
  deserialized.package
}
