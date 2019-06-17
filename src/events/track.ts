import { Message } from './message'
import { Facade } from '../lib'
import { Track as Spec } from '@segment/spec/events/'

export class Track extends Message implements Spec {
  public type: Spec["type"]
  public event: string
  public properties: { [key: string]: any }
  constructor(event: Spec) {
    super(event)
    this.type = event.type
    this.event = event.event
    this.properties = new Facade(event.properties)
  }
}
