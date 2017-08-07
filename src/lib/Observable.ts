import Observer from './Observer'


export default class Observable<T> {
  private observers: Observer<T>[]
  value: T

  constructor(public initialValue: T) {
    this.value = initialValue
  }

  addObserver(observer: Observer<T>) {
    this.observers.push(observer)
  }

  removeObserver(observer: Observer<T>) {
    this.observers = this.observers.filter(item => item !== observer)
  }

  update(value: T) {
    this.value = value
    this.observers.forEach(observer => {
      observer(this)
    })
  }
}
