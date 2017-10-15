import * as _ from 'lodash'


export default class Store {
  static initialState: {[key: string]: any} = {}
  private state: {[key: string]: any} = {}
  private subscribers: (() => void)[] = []

  constructor() {
    if (_.isEqual((this.constructor as typeof Store).initialState, {})) {
      console.error('You must define initialState')
    }

    Object.keys((this.constructor as typeof Store).initialState).forEach(key => {
      this.state[key] = (this.constructor as typeof Store).initialState[key]
      Object.defineProperty(this, key, {
        get: () => this.state[key],
        set: (value: any) => {
          this.state[key] = value
          this.notify()
        }
      })
    })
  }

  subscribe(handler: () => void) {
    this.subscribers.push(handler)
  }

  unsubscribe(handler: () => void) {
    _.pull(this.subscribers, handler)
  }

  notify() {
    this.subscribers.forEach(handler => handler())
  }
}
