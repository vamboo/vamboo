import Observer from './Observer'


export default class Observable<T> {
  private observers: Observer<T>[] = []
  private _value: T

  constructor(initialValue: T) {
    this._value = initialValue
  }

  addObserver(observer: Observer<T>) {
    this.observers.push(observer)
  }

  removeObserver(observer: Observer<T>) {
    this.observers = this.observers.filter(item => item !== observer)
  }

  notifyObservers() {
    this.observers.forEach(observer => {
      observer(this)
    })
  }

  get value() {
    return this._value
  }

  set value(newValue) {
    this._value = newValue
    this.notifyObservers()
  }
}
