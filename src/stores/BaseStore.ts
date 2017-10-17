import * as _ from 'lodash'
import Subscription from '../lib/Subscription'


// TODO: この状態管理機構にタイムトラベルデバッギング機能とか付けて売り出す
export default class BaseStore {
  private subscription = new Subscription(new Map<string, any>())
  subscribe = this.subscription.subscribe.bind(this.subscription)
  unsubscribe = this.subscription.unsubscribe.bind(this.subscription)

  configure() {
    const stateNames = _.difference(Object.keys(this), Object.keys(new BaseStore))

    stateNames.forEach(stateName => {
      this.subscription.value.set(stateName, (this as {[key: string]: any})[stateName])

      Object.defineProperty(this, stateName, {
        get: () => this.subscription.value.get(stateName),
        set: (value: any) => {
          this.subscription.value.set(stateName, value)
          this.subscription.notify()
        }
      })
    })
  }
}
