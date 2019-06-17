import { Message } from './message'
import { Company } from '../types/common'
import { Group as Spec } from '@segment/spec/events'

export class Group extends Message implements Spec {
  public type: Spec["type"]
  public traits: Company
  constructor(event: Spec) {
    super(event)
    this.type = event.type
    this.traits = new Company(event.traits)
  }
}
