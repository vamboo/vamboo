declare module 'react-hyperscript' {
  import {ComponentClass, StatelessComponent, ReactElement} from 'react'

  var h: {
    <P>(
      componentOrTag: ComponentClass<P> | StatelessComponent<P> | string,
      properties?: P,
      children?: ReactElement<any>[] | string
    ): ReactElement<P>
  }
  export = h
}
