import { Facade } from '../src'
import * as Spec from '@segment/spec/events'
import { App, Device, Network, OS } from '../types/mobile'
import { Campaign, Window } from '../types/web'

export class Context extends Facade<Spec.Context> implements Spec.Context {
  public app: App
  public device: Device
  public network: Network
  public os: OS
  public campaign: Campaign
  public page: Window

  constructor(properties: any) {
    super(properties)
    this.app = new App(this.toJSON().app)
    this.device = new Device(this.toJSON().device)
    this.network = new Network(this.toJSON().network)
    this.os = new OS(this.toJSON().os)
    this.campaign = new Campaign(this.toJSON().campaign || {})
    this.page = new Window(this.toJSON().page || {})
  }

  get ip() {
    return this.toJSON().ip
  }

  get locale() {
    return this.toJSON().locale
  }

  get userAgent() {
    return this.toJSON().userAgent || this.toJSON().user_agent as Spec.Context["userAgent"]
  }
}

export class Message extends Facade<Spec.Message> implements Spec.Message {
  public context: Context
  public type: Spec.Events
  constructor(event: Spec.Message) {
    super(event)
    this.type = event.type
    this.context = new Context(this.toJSON().context)
  }

  get userId() {
    return this.toJSON().userId || this.toJSON().user_id as Spec.Message["userId"]
  }

  get timestamp() {
    return this.toJSON().timestamp
  }

  get messageId() {
    return this.toJSON().messageId
  }

  get receivedAt() {
    return this.toJSON().receivedAt
  }

  get anonymousId() {
    return this.toJSON().anonymousId
  }

  get sentAt() {
    return this.toJSON().sentAt
  }
}
