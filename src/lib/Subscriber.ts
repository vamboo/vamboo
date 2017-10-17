import Subscription from './Subscription'


interface Subscriber<T> {
  (subscription: Subscription<T>): void
}

export default Subscriber
