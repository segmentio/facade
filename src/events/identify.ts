import { Message } from './message'
import { Facade } from '../lib'
import { Identify as Spec } from '@segment/spec/events'

export class Identify extends Message implements Spec {
  public type: Spec["type"]
  public traits: Facade
  constructor(event: Spec) {
    super(event)
    this.type = event.type
    this.traits = new Facade(event.traits)
  }
}
