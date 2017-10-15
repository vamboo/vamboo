import BaseStore from './BaseStore'
import Input from '../lib/Input'
import Output from '../lib/Output'


class Point {
  constructor(public x: number, public y: number) {}
}

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

  start(startsFrom: Point, output: Output<any>) {
    (this as any).floatingArrow = new FloatingArrow(startsFrom, output)
  }

  finish(endsAt: Point, input: Input<any>) {
    console.assert((this as any).floatingArrow !== null)

    (input as any).connect((this as any).floatingArrow!.output)
    (this as any).placedArrows = (this as any).placedArrows.concat([new Arrow((this as any).floatingArrow!.startsFrom, endsAt)])
    (this as any).floatingArrow = null

    console.log('finish', (this as any).placedArrows)
  }
}

export default new ArrowStore
