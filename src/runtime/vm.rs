unsafe fn treat_as<'a, T: 'a, U: 'a>(data: &'a T, qty: usize) -> &'a [U] {
  std::slice::from_raw_parts(data as *const T as *const U, qty)
}

type Byte = u8;

trait VambooValue {}
impl VambooValue for f32 {}
impl VambooValue for String {}

struct ValueStack(Vec<Byte>);

impl ValueStack {
  fn new() -> Self {
    let one_mib = 1048576;
    ValueStack(Vec::with_capacity(one_mib))
  }

  fn push<T: VambooValue>(&mut self, value: T) {
    {
      let in_bytes: &[Byte] = unsafe {
        treat_as(&value, std::mem::size_of::<T>())
      };
      self.0.extend_from_slice(in_bytes);
    };

    // This makes heaps referred by T not get released.
    // Usually, it causes memory leak, but not in this case.
    // See comments in pop.
    std::mem::forget(value);
  }

  // If T and type of stack top value differs, the return value doesn't make sense.
  unsafe fn pop<T: VambooValue>(&mut self) -> T {
    let value_offset = self.0.len() - std::mem::size_of::<T>();
    let value_ptr = &self.0[value_offset] as *const Byte as *const T;
    // Usually, this makes an unsound state that two stacks refer same heap.
    // But now, heaps referred by value_ptr is not referred by anyone, so this operation is safe.
    let value = std::ptr::read(value_ptr);

    self.0.split_off(value_offset);

    // When the lifetime of this value ends, heaps referred by this value get released.
    // So the memory leak will not happen.
    // See comments in push.
    value
  }
}
