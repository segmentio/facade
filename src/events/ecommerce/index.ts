import { Track } from '../track'
import * as Spec from '@segment/spec/events/ecommerce'
import { Order, ProductList, Product, Promotion, CheckoutStep, Cart } from '../../types/ecommerce'

export class PromotionClicked extends Track implements Spec.PromotionClicked {
  public event: Spec.PromotionClicked["event"]
  public properties: Promotion
  constructor(event: Spec.PromotionClicked) {
    super(event)
    this.event = event.event
    this.properties = new Promotion(event.properties)
  }
}

export class ProductClicked extends Track implements Spec.ProductClicked {
  public event: Spec.ProductClicked["event"]
  public properties: Product
  constructor(event: Spec.ProductClicked) {
    super(event)
    this.event = event.event
    this.properties = new Product(event.properties)
  }
}

export class ProductViewed extends Track implements Spec.ProductViewed {
  public event: Spec.ProductViewed["event"]
  public properties: Product
  constructor(event: Spec.ProductViewed) {
    super(event)
    this.event = event.event
    this.properties = new Product(event.properties)
  }
}

export class ProductAdded extends Track implements Spec.ProductAdded {
  public event: Spec.ProductAdded["event"]
  public properties: Product
  constructor(event: Spec.ProductAdded) {
    super(event)
    this.event = event.event
    this.properties = new Product(event.properties)
  }
}

export class ProductRemoved extends Track implements Spec.ProductRemoved {
  public event: Spec.ProductRemoved["event"]
  public properties: Product
  constructor(event: Spec.ProductRemoved) {
    super(event)
    this.event = event.event
    this.properties = new Product(event.properties)
  }
}

export class CartViewed extends Track implements Spec.CartViewed {
  public event: Spec.CartViewed["event"]
  public properties: Cart
  constructor(event: Spec.CartViewed) {
    super(event)
    this.event = event.event
    this.properties = new Cart(event.properties)
  }
}

export class ProductListViewed extends Track implements Spec.ProductListViewed {
  public event: Spec.ProductListViewed["event"]
  public properties: ProductList
  constructor(event: Spec.ProductListViewed) {
    super(event)
    this.event = event.event
    this.properties = new ProductList(event.properties)
  }
}

export class ProductListFiltered extends Track implements Spec.ProductListFiltered {
  public event: Spec.ProductListFiltered["event"]
  public properties: ProductList
  constructor(event: Spec.ProductListFiltered) {
    super(event)
    this.event = event.event
    this.properties = new ProductList(event.properties)
  }
}

export class PromotionViewed extends Track implements Spec.PromotionViewed {
  public event: Spec.PromotionViewed["event"]
  public properties: Promotion
  constructor(event: Spec.PromotionViewed) {
    super(event)
    this.event = event.event
    this.properties = new Promotion(event.properties)
  }
}

export class CheckoutStarted extends Track implements Spec.CheckoutStarted {
  public event: Spec.CheckoutStarted["event"]
  public properties: Order
  constructor(event: Spec.CheckoutStarted) {
    super(event)
    this.event = event.event
    this.properties = new Order(event.properties)
  }
}

export class CheckoutStepViewed extends Track implements Spec.CheckoutStepViewed {
  public event: Spec.CheckoutStepViewed["event"]
  public properties: CheckoutStep
  constructor(event: Spec.CheckoutStepViewed) {
    super(event)
    this.event = event.event
    this.properties = new CheckoutStep(event.properties)
  }
}

export class CheckoutStepCompleted extends Track implements Spec.CheckoutStepCompleted {
  public event: Spec.CheckoutStepCompleted["event"]
  public properties: CheckoutStep
  constructor(event: Spec.CheckoutStepCompleted) {
    super(event)
    this.event = event.event
    this.properties = new CheckoutStep(event.properties)
  }
}

export class PaymentInfoEntered extends Track implements Spec.PaymentInfoEntered {
  public event: Spec.PaymentInfoEntered["event"]
  public properties: CheckoutStep
  constructor(event: Spec.PaymentInfoEntered) {
    super(event)
    this.event = event.event
    this.properties = new CheckoutStep(event.properties)
  }
}

export class OrderUpdated extends Track implements Spec.OrderUpdated {
  public event: Spec.OrderUpdated["event"]
  public properties: Order
  constructor(event: Spec.OrderUpdated) {
    super(event)
    this.event = event.event
    this.properties = new Order(event.properties)
  }
}

export class OrderCompleted extends Track implements Spec.OrderCompleted {
  public event: Spec.OrderCompleted["event"]
  public properties: Order
  constructor(event: Spec.OrderCompleted) {
    super(event)
    this.event = event.event
    this.properties = new Order(event.properties)
  }
}

export class OrderRefunded extends Track implements Spec.OrderRefunded {
  public event: Spec.OrderRefunded["event"]
  public properties: Order
  constructor(event: Spec.OrderRefunded) {
    super(event)
    this.event = event.event
    this.properties = new Order(event.properties)
  }
}

export class OrderCancelled extends Track implements Spec.OrderCancelled {
  public event: Spec.OrderCancelled["event"]
  public properties: Order
  constructor(event: Spec.OrderCancelled) {
    super(event)
    this.event = event.event
    this.properties = new Order(event.properties)
  }
}
