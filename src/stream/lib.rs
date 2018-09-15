pub trait Observer<T> {
    fn on_notify(&mut self, notification: &T);
}

#[cfg(test)]
pub struct MockObserver<T> {
    pub expects: T
}

#[cfg(test)]
impl<T: std::fmt::Debug + std::cmp::PartialEq> Observer<T> for MockObserver<T> {
    fn on_notify(&mut self, notification: &T) {
        assert_eq!(*notification, self.expects)
    }
}

pub trait Observable<'a, 'b: 'a, T: 'b> {
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
