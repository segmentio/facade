import { Facade } from '../../src'
import * as Spec from '@segment/spec/types/mobile'

export class App extends Facade<Spec.Application> implements Spec.Application {
  constructor(properties: any) {
    super(properties)
  }
  get build() {
    return this.toJSON().build
  }

  get name() {
    return this.toJSON().name
  }

  get version() {
    return this.toJSON().version
  }
}

export class Device extends Facade<Spec.Device> implements Spec.Device {
  constructor(properties: any) {
    super(properties)
  }

  get id() {
    return this.toJSON().id
  }

  get manufacturer() {
    return this.toJSON().manufacturer
  }

  get model() {
    return this.toJSON().model
  }

  get name(){
    return this.toJSON().name
  }

  get type() {
    return this.toJSON().type
  }

  get version() {
    return this.toJSON().version
  }
}

export class Network extends Facade<Spec.Network> implements Spec.Network {
  constructor(properties: any) {
    super(properties)
  }

  get bluetooth() {
    return this.toJSON().bluetooth
  }

  get carrier() {
    return this.toJSON().carrier
  }

  get cellular() {
    return this.toJSON().cellular
  }

  get wifi() {
    return this.toJSON().wifi
  }
}

export class OS extends Facade<Spec.OS> implements Spec.OS {
  constructor(properties: any) {
    super(properties)
  }

  get name() {
    return this.toJSON().name
  }

  get version() {
    return this.toJSON().version
  }
}

export class Campaign extends Facade<Spec.Campaign> implements Spec.Campaign {
  get source () {
    return this.toJSON().source
  }

  get name () {
    return this.toJSON().name
  }

  get content () {
    return this.toJSON().content
  }

  get adCreative () {
    return this.toJSON().adCreative
  }

  get adGroup () {
    return this.toJSON().adGroup
  }
}

export class ApplicationUpdate extends Facade<Spec.ApplicationUpdate> implements Spec.ApplicationUpdate {
  get build() {
    return this.toJSON().build
  }

  get previousBuild() {
    return this.toJSON().previousBuild || this.toJSON().previous_build as Spec.ApplicationUpdate["previousBuild"]
  }

  get previousVersion() {
    return this.toJSON().previousVersion || this.toJSON().previous_version as Spec.ApplicationUpdate["previousVersion"]
  }

  get version() {
    return this.toJSON().version
  }
}

export class ApplicationOpen extends Facade<Spec.ApplicationOpen> implements Spec.ApplicationOpen {
  get build() {
    return this.toJSON().build
  }

  get fromBackground() {
    return this.toJSON().fromBackground || this.toJSON().from_background as Spec.ApplicationOpen["fromBackground"]
  }

  get referringApplication() {
    return this.toJSON().referringApplication || this.toJSON().referring_application as Spec.ApplicationOpen["referringApplication"]
  }

  get url() {
    return this.toJSON().url
  }

  get version() {
    return this.toJSON().version
  }
}

export class InstallAttribution extends Facade<Spec.InstallAttribution> implements Spec.InstallAttribution {
  public campaign: Campaign
  constructor(properties: Spec.InstallAttribution) {
    super(properties)
    this.campaign = new Campaign(this.toJSON().campaign || {})
  }

  get provider () {
    return this.toJSON().provider
  }
}

export class PushNotification extends Facade<Spec.PushNotification> implements Spec.PushNotification {
  public campaign: Campaign
  constructor(properties: Spec.PushNotification) {
    super(properties)
    this.campaign = new Campaign(this.toJSON().campaign)
  }

  get action () {
    return this.toJSON().action
  }
}

export class DeepLink extends Facade<Spec.DeepLink> implements Spec.DeepLink {
  get provider () {
    return this.toJSON().provider
  }

  get url() {
    return this.toJSON().url
  }
}

export class Install extends Facade<Spec.Install> implements Spec.Install {
  get build() {
    return this.toJSON().build
  }

  get version() {
    return this.toJSON().version
  }
}
