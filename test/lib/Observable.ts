import test from 'ava'
import * as sinon from 'sinon'
import Observable from '../../src/lib/Observable'


test('initial value', t => {
  const observable = new Observable(1)
  t.is(observable.value, 1)
})

test('update value', t => {
  const observable = new Observable(1)
  observable.value = 2
  t.is(observable.value, 2)
})

test('call observers on update', t => {
  const observable = new Observable(1)

  const observer1 = sinon.spy()
  observable.addObserver(observer1)
  const observer2 = sinon.spy()
  observable.addObserver(observer2)

  observable.value = 2
  t.is(observer1.lastCall.args[0].value, 2)
  t.is(observer2.lastCall.args[0].value, 2)
})

test('notify current value', t => {
  const observable = new Observable(1)
  const observer = sinon.spy()
  observable.addObserver(observer)

  observable.notifyObservers()
  t.is(observer.lastCall.args[0].value, 1)
})
