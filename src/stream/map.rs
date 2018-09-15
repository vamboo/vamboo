use super::lib::*;

pub struct MappedStream<'a, T, U: 'a> {
    observers: Vec<&'a mut Observer<U>>,
    f: Box<Fn(&T) -> U>
}

impl<'a, T, U> MappedStream<'a, T, U> {
    pub fn new(f: Box<Fn(&T) -> U>) -> Self {
        MappedStream {
            observers: vec![],
            f
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
