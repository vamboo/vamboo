import Observable from './Observable'


export default class Output<T> {
  observable: Observable<T>

  constructor(public name: string, initialValue: T) {
    this.observable = new Observable(initialValue)
  }
}
