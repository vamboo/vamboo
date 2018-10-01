extern crate bincode;

unsafe fn treat_as<'a, T: 'a, U: 'a>(data: &'a T, qty: usize) -> &'a [U] {
  std::slice::from_raw_parts(data as *const T as *const U, qty)
}

type Byte = u8;
type Bytecode = Vec<Byte>;
type MayFail<T> = Result<T, failure::Error>;

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

struct RunningFunction {
  function_index: usize,
  instruction_index: usize
}

impl RunningFunction {
  fn new(function_index: usize) -> RunningFunction {
    RunningFunction {
      function_index,
      instruction_index: 0
    }
  }
}

struct VM {
  functions: Vec<Bytecode>,
  native_functions: Vec<fn(&mut VM) -> ()>,
  call_stack: Vec<RunningFunction>,
  value_stack: ValueStack
}

impl VM {
  fn new(functions: Vec<Bytecode>) -> VM {
    let initial_call_stack_size = 1024;
    let mut result = VM {
      functions,
      native_functions: vec![],
      call_stack: Vec::with_capacity(initial_call_stack_size),
      value_stack: ValueStack::new()
    };

    result.call_stack.push(RunningFunction::new(0));

    result
  }

  fn step(&mut self) {
    match self.read(1).first() {
      Some(op_code) => Instruction::new(*op_code).step(self),
      None => {
        self.call_stack.pop();
      }
    }
  }

  fn read(&mut self, how_many: usize) -> &[Byte] {
    let call_stack_top = self.call_stack.last_mut().unwrap();
    let result = &self.functions[call_stack_top.function_index][call_stack_top.instruction_index .. call_stack_top.instruction_index + how_many];

    call_stack_top.instruction_index += how_many;
    result
  }
}

enum Instruction {
  Push(u8),
  Call,
  CallNative
}

impl<'a> Instruction {
  // FIXME: op_code should be &Byte but I tired of fighting against borrow checker.
  fn new(op_code: Byte) -> Instruction {
    match op_code {
      0x00 => Instruction::CallNative,
      0xff => Instruction::Call,
      length@_ => Instruction::Push(length)
    }
  }

  fn step(self, vm: &mut VM) {
    match self {
      Instruction::CallNative => {
        let mut buffer: [Byte; 2] = [0; 2];
        buffer.copy_from_slice(vm.read(2));
        let function_index = u16::from_le_bytes(buffer);
        vm.native_functions[function_index as usize](vm);
      },
      Instruction::Call => {
        let mut buffer: [Byte; 2] = [0; 2];
        buffer.copy_from_slice(vm.read(2));
        let function_index = u16::from_le_bytes(buffer);
        vm.call_stack.push(RunningFunction::new(function_index as usize));
      },
      Instruction::Push(length_field_length) => {
        assert!(length_field_length <= 4);

        let mut length_bytes_with_padding: [u8; 4] = [0; 4];
        let length_bytes = vm.read(length_field_length as usize);
        unsafe {
          std::ptr::copy_nonoverlapping(
            length_bytes.as_ptr(),
            length_bytes_with_padding.as_mut_ptr(),
            length_bytes.len()
          )
        };
        let length = usize::from_le_bytes(length_bytes_with_padding);

        // FIXME: This should be done without to_vec but I tired of fighting against borrow checker.
        let mut serialized = vm.read(length).to_vec();
        vm.value_stack.0.append(&mut serialized);
      }
    }
  }
}
