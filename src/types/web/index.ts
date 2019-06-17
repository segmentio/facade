import { Facade } from '../../src'
import * as Spec from '@segment/spec/types/web'

export class Campaign extends Facade<Spec.Campaign> implements Spec.Campaign {
  constructor(properties: Spec.Campaign) {
    super(properties)
  }

  get content() {
    return this.toJSON().content
  }

  get medium() {
    return this.toJSON().medium
  }

  get name() {
    return this.toJSON().name
  }

  get source() {
    return this.toJSON().source
  }

  get term() {
    return this.toJSON().term
  }
}

export class Window extends Facade<Spec.Window> implements Spec.Window {
  get path() {
    return this.toJSON().path
  }

  get referrer() {
    return this.toJSON().referrer
  }

  get search() {
    return this.toJSON().search
  }

  get title()  {
    return this.toJSON().title
  }

  get url() {
    return this.toJSON().url
  }
}
