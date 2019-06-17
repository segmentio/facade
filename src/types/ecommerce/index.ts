import { Facade } from '../../lib'
import * as Spec from '@segment/spec/types/ecommerce'

export class Product extends Facade<Spec.Product> implements Spec.Product {
  get brand() {
    return this.toJSON().brand
  }

  get category() {
    return this.toJSON().category
  }

  get coupon() {
    return this.toJSON().coupon
  }

  get imageUrl() {
    return this.toJSON().imageUrl || this.toJSON().image_url as Spec.Product["imageUrl"]
  }

  get name() {
    return this.toJSON().name
  }

  get position() {
    return this.toJSON().position
  }

  get price() {
    return this.toJSON().price
  }

  get productId() {
    return this.toJSON().productId || this.toJSON().product_id as Spec.Product["productId"]
  }

  get quantity() {
    return this.toJSON().quantity
  }

  get sku() {
    return this.toJSON().sku
  }

  get url() {
    return this.toJSON().url
  }

  get variant() {
    return this.toJSON().variant
  }
}

export class Order extends Facade<Spec.Order> implements Spec.Order {
  public products: Product[]

  constructor(event: Spec.Order) {
    super(event)
    const products = this.toJSON().products
    if (Array.isArray(products)) {
      this.products = products.map(product => new Product(product))
    } else {
      this.products = []
    }
  }

  get affiliation() {
    return this.toJSON().affiliation
  }

  get checkoutId() {
    return this.toJSON().checkoutId || this.toJSON().checkout_id as Spec.Order["checkoutId"]
  }

  get coupon() {
    return this.toJSON().coupon
  }

  get currency() {
    return this.toJSON().currency
  }

  get discount() {
    return this.toJSON().discount
  }

  get orderId() {
    return this.toJSON().orderId || this.toJSON().order_id as Spec.Order["orderId"]
  }

  get revenue() {
    return this.toJSON().revenue
  }

  get shipping() {
    return this.toJSON().shipping
  }

  get tax() {
    return this.toJSON().tax
  }

  get total() {
    return this.toJSON().total
  }
}

class Filter extends Facade<Spec.Filter> implements Spec.Filter {
  get type() {
    return this.toJSON().type
  }

  get value() {
    return this.toJSON().value
  }
}

class Sort extends Facade<Spec.Sorts> implements Spec.Sorts {
  get type() {
    return this.toJSON().type
  }

  get value() {
    return this.toJSON().value
  }
}

export class ProductList extends Facade<Spec.ProductList> implements Spec.ProductList {
  public products: Product[]
  public filters: Filter[]
  public sorts: Sort[]
  constructor(event: Spec.ProductList) {
    super(event)

    const products = this.toJSON().products
    if (Array.isArray(products)) {
      this.products = products.map(product => new Product(product))
    } else {
      this.products = []
    }

    const filters = this.toJSON().filters
    if (Array.isArray(filters)) {
      this.filters = filters.map(filter => new Filter(filter))
    } else {
      this.filters = []
    }

    const sorts = this.toJSON().sorts
    if (Array.isArray(sorts)) {
      this.sorts = sorts.map(sort => new Sort(sort))
    } else {
      this.sorts = []
    }
  }

  get category() {
    return this.toJSON().category
  }

  get listId() {
    return this.toJSON().listId || this.toJSON().list_id as Spec.ProductList["listId"]
  }
}

export class Promotion extends Facade<Spec.Promotion> implements Spec.Promotion {
  get creative() {
    return this.toJSON().creative
  }

  get name() {
    return this.toJSON().name
  }

  get position() {
    return this.toJSON().position
  }

  get promotionId() {
    return this.toJSON().promotionId
  }
}

export class CheckoutStep extends Facade<Spec.CheckoutStep> implements Spec.CheckoutStep {
  get checkoutId() {
    return this.toJSON().checkoutId
  }

  get orderId() {
    return this.toJSON().orderId
  }

  get step() {
    return this.toJSON().step
  }

  get shippingMethod() {
    return this.toJSON().shippingMethod
  }

  get paymentMethod() {
    return this.toJSON().paymentMethod
  }
}

export class Cart extends Facade<Spec.Cart> implements Spec.Cart {
  public products: Product[]
  constructor(properties: Spec.Cart) {
    super(properties)
    const products = properties.products
    if (Array.isArray(products)) {
      this.products = products.map(product => new Product(product))
    } else {
      this.products = []
    }
  }
  get cartId() {
    return this.toJSON().cartId || this.toJSON().cart_id as Spec.Cart["cartId"]
  }
}
