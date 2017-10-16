import * as _ from 'lodash'


// TODO: この状態管理機構にタイムトラベルデバッギング機能とか付けて売り出す

export default class BaseStore {
  private state: {[key: string]: any} = {}
  private subscribers: (() => void)[] = []

  configure() {
    const stateNames = _.difference(Object.keys(this), Object.keys(new BaseStore))

    stateNames.forEach(stateName => {
      this.state[stateName] = (this as {[key: string]: any})[stateName]

      Object.defineProperty(this, stateName, {
        get: () => this.state[stateName],
        set: (value: any) => {
          this.state[stateName] = value
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
