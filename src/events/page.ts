import { Page as Spec } from '@segment/spec/events'
import { Message } from './message'
import { Window } from '../types/web'

export class Page extends Message implements Spec {
  public type: Spec["type"]
  public properties: Window
  constructor(event: Spec) {
    super(event)
    this.type = event.type
    this.properties = new Window(event.properties)
  }
}
