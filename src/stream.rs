trait Observer<T> {
    fn on_notify(&mut self, notification: &T);
}

trait Observable<'a, 'b: 'a, T: 'b> {
    fn observers(&'a mut self) -> &'a mut Vec<&'b mut Observer<T>>;

    fn add_observer(&'a mut self, observer: &'b mut Observer<T>) {
        self.observers().push(observer)
    }

    fn notify(&'a mut self, notification: T) {
        for observer in self.observers() {
            observer.on_notify(&notification)
        }
    }

    fn optimize_memory(&'a mut self) {
        self.observers().shrink_to_fit()
    }
}

struct MappedStream<'a, T, U: 'a> {
    observers: Vec<&'a mut Observer<U>>,
    f: Box<Fn(&T) -> U>
}

impl<'a, T, U> MappedStream<'a, T, U> {
    fn new(f: Box<Fn(&T) -> U>) -> Self {
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
