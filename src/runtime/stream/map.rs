extern crate wasm_bindgen_test;
use wasm_bindgen_test::*;

use super::lib::*;

pub struct MappedStream<'a, T, U: 'a> {
  observers: Vec<&'a mut Observer<U>>,
  f: Box<Fn(&T) -> U>,
}

impl<'a, T, U> MappedStream<'a, T, U> {
  pub fn new(f: Box<Fn(&T) -> U>) -> Self {
    MappedStream {
      observers: Vec::with_capacity(1),
      f,
    }
  }
}

impl<'a, 'b: 'a, T, U: 'b> Observable<'a, 'b, U> for MappedStream<'b, T, U> {
  fn observers(&'a mut self) -> &'a mut Vec<&'b mut Observer<U>> {
    &mut self.observers
  }
}

impl<'a, T, U> Observer<T> for MappedStream<'a, T, U> {
  fn on_notify(&mut self, notification: &T) {
    let mapped = (*(self.f))(notification);
    self.notify(mapped)
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[wasm_bindgen_test]
  fn it_works() {
    // Given
    let mut before_map = MappedStream::new(Box::new(|x| x + 100));
    let mut after_map = MockObserver::new();
    before_map.add_observer(&mut after_map);

    // When
    before_map.on_notify(&1);

    // Then
    assert!(after_map.on_notify.called_with(101));
  }
}
