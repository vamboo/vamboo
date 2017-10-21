import BaseStore from './BaseStore'
import Input from '../lib/Input'
import Output from '../lib/Output'


class UIVisibilityStore extends BaseStore {
  isVisible: boolean = true

  constructor() {
    super()

    this.configure()
  }

  toggle() {
    console.log(this.isVisible, !this.isVisible)
    this.isVisible = !this.isVisible
  }
}

export default new UIVisibilityStore
