pub trait Observer<T> {
    fn on_notify(&mut self, notification: &T);
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

#[cfg(test)]
use pseudo::Mock;

#[cfg(test)]
pub struct MockObserver<T: Copy> {
    pub on_notify: Mock<T, ()>
}

#[cfg(test)]
impl<T: Copy> MockObserver<T> {
    pub fn new() -> MockObserver<T> {
        MockObserver {
            on_notify: Mock::default()
        }
    }
}

#[cfg(test)]
impl<T: Copy> Observer<T> for MockObserver<T> {
    fn on_notify(&mut self, notification: &T) {
        self.on_notify.call(*notification)
    }
}
