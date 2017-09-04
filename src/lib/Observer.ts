import Observable from './Observable'


interface Observer<T> {
  (observable: Observable<T>): void
}


export default Observer
