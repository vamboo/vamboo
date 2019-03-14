use frappe::{Sink, Stream};

pub(crate) fn imitate<T: 'static>(sink: Sink<T>, stream: Stream<T>) {
  stream.observe(move |value| sink.send(value))
}

// We should write depends before imitate, otherwise MaybeOwned::Borrowed will be sent to the imitating Sink.
pub(crate) fn depends<T: Clone + 'static, U: 'static>(stream: &Stream<T>, dependence: &Stream<U>) -> Stream<T> {
  stream
    .merge_with(dependence, |x| Some(x.into_owned()), |_| None)
    .filter_map(|x| x.into_owned())
}
