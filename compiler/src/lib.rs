extern crate proc_macro;
use crate::proc_macro::TokenStream;

extern crate syn;
#[macro_use] extern crate quote;

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
