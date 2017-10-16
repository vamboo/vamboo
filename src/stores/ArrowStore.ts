import BaseStore from './BaseStore'
import Input from '../lib/Input'
import Output from '../lib/Output'
import Point from '../lib/Point'

class Arrow {
  constructor(public start: Point, public end: Point) {}
}

class FloatingArrow {
  constructor(public startsFrom: Point, public output: Output<any>) {}
}

class ArrowStore extends BaseStore {
  static initialState: {
    placedArrows: Arrow[],
    floatingArrow: FloatingArrow | null
  } = {
    placedArrows: [],
    floatingArrow: null
  }

  start(this: any, startsFrom: Point, output: Output<any>) {
    this.floatingArrow = new FloatingArrow(startsFrom, output)
  }

  finish(this: any, endsAt: Point, input: Input<any>) {
    console.assert(this.floatingArrow !== null)

    input.connect(this.floatingArrow!.output)
    this.placedArrows = this.placedArrows.concat([new Arrow(this.floatingArrow!.startsFrom, endsAt)])
    this.floatingArrow = null

    console.log('finish', this.placedArrows)
  }
}

export default new ArrowStore
