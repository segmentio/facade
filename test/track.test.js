'use strict';

var Track = require('../lib').Track;
var assert = require('proclaim');

describe('Track', function() {
  var args = {
    userId: 'calvin@segment.io',
    sessionId: 'abc123',
    properties: {
      revenue: '$50',
      referrer: 'http://segment.io',
      username: 'calvinfo',
      email: 'test@segment.io'
    },
    options: {
      query: 'segmentio',
      traits: {
        someTrait: 'y'
      }
    }
  };

  var track = new Track(args);

  describe('.id()', function() {
    it('should proxy properties.id as default fallback', function() {
      var msg = new Track({ properties: { id: '1738' } });
      assert.strictEqual(msg.id(), '1738');
    });

    it('should proxy properties\' [object]Id', function() {
      var msg = new Track({ properties: { productId: '1738' } });
      assert.strictEqual(msg.id('product'), '1738');
    });

    it('should proxy properties\' [object]_id', function() {
      var msg = new Track({ properties: { promotion_id: '1738' } });
      assert.strictEqual(msg.id('promotion'), '1738');
    });

    it('should respect falback order: snake_case || camelCase', function() {
      var msg = new Track({ properties: { order_id: 'yolo', orderId: 'yolo2' } }); 
      assert.strictEqual(msg.id('order'), 'yolo');
    });
  });

  describe('.sku()', function() {
    it('should proxy properties.sku', function() {
      var msg = new Track({ properties: { sku: '12039' } });
      assert.strictEqual(msg.sku(), '12039');
    });
  });

  describe('.repeat()', function() {
    it('should proxy properties.repeat', function() {
      var msg = new Track({ properties: { repeat: true } });
      assert.strictEqual(msg.repeat(), true);
    });
  });

  describe('.type()', function() {
    it('should have the proper .type()', function() {
      assert.strictEqual(track.type(), 'track');
    });

    it('should equal .action()', function() {
      assert.strictEqual(track.type(), track.action());
    });
  });

  describe('.userId()', function() {
    it('should proxy the userId', function() {
      assert.strictEqual(track.userId(), args.userId);
    });
  });

  describe('.sessionId()', function() {
    it('should proxy the sessionId', function() {
      assert.strictEqual(track.sessionId(), args.sessionId);
    });
  });

  describe('.event()', function() {
    it('should proxy the event', function() {
      assert.strictEqual(track.event(), args.event);
    });
  });

  describe('.quantity()', function() {
    it('should return the quantity', function() {
      var track = new Track({ properties: { quantity: 2 } });
      assert.strictEqual(track.quantity(), 2);
    });

    it('should default quantity to 1', function() {
      var track = new Track({});
      assert.strictEqual(track.quantity(), 1);
    });
  });

  describe('.currency()', function() {
    it('should return the currency code', function() {
      var track = new Track({ properties: { currency: 'EUR' } });
      assert.strictEqual(track.currency(), 'EUR');
    });

    it('should default currency to `USD`', function() {
      var track = new Track({});
      assert.strictEqual(track.currency(), 'USD');
    });
  });

  describe('.subtotal()', function() {
    it('should get subtotal', function() {
      var track = new Track({ properties: { subtotal: 10 } });
      assert.strictEqual(track.subtotal(), 10);
    });

    it('should compute subtotal from total', function() {
      var track = new Track({ properties: { total: 10, tax: 2, shipping: 2 } });
      assert.strictEqual(track.subtotal(), 6);
    });

    it('should compute subtotal from .tax, .shipping, .discount and .total', function() {
      var track = new Track({ properties: { Total: 10, Tax: 2, Shipping: 2, Discount: 1 } });
      assert.strictEqual(track.subtotal(), 7);
    });

    it('should lookup .subtotal properly', function() {
      var track = new Track({ properties: { Subtotal: 10 } });
      assert.strictEqual(track.subtotal(), 10);
    });
  });

  describe('.category()', function() {
    it('should proxy category', function() {
      var track = new Track({ properties: { category: 'category' } });
      assert.strictEqual(track.category(), 'category');
    });
  });

  describe('.state()', function() {
    it('should proxy state', function() {
      var track = new Track({ properties: { state: 'state' } });
      assert.strictEqual(track.state(), 'state');
    });
  });

  describe('.city()', function() {
    it('should proxy city', function() {
      var track = new Track({ properties: { city: 'city' } });
      assert.strictEqual(track.city(), 'city');
    });
  });

  describe('.zip()', function() {
    it('should proxy zip', function() {
      var track = new Track({ properties: { zip: 'zip' } });
      assert.strictEqual(track.zip(), 'zip');
    });
  });

  describe('.tax()', function() {
    it('should proxy tax', function() {
      var track = new Track({ properties: { tax: 'tax' } });
      assert.strictEqual(track.tax(), 'tax');
    });
  });

  describe('.name()', function() {
    it('should proxy name', function() {
      var track = new Track({ properties: { name: 'name' } });
      assert.strictEqual(track.name(), 'name');
    });
  });

  describe('.country()', function() {
    it('should proxy country', function() {
      var track = new Track({ properties: { country: 'country' } });
      assert.strictEqual(track.country(), 'country');
    });

    it('should proxy context.traits', function() {
      var track = new Track({
        context: {
          traits: {
            address: {
              country: 'country'
            }
          }
        }
      });

      assert.strictEqual(track.country(), 'country');
    });
  });

  describe('.price()', function() {
    it('should proxy price', function() {
      var track = new Track({ properties: { price: 'price' } });
      assert.strictEqual(track.price(), 'price');
    });
  });

  describe('.total()', function() {
    it('should proxy total', function() {
      var track = new Track({ properties: { total: 'total' } });
      assert.strictEqual(track.total(), 'total');
    });
  });

  describe('.coupon()', function() {
    it('should proxy coupon', function() {
      var track = new Track({ properties: { coupon: 'coupon' } });
      assert.strictEqual(track.coupon(), 'coupon');
    });
  });

  describe('.shipping()', function() {
    it('should proxy shipping', function() {
      var track = new Track({ properties: { shipping: 'shipping' } });
      assert.strictEqual(track.shipping(), 'shipping');
    });
  });

  describe('.discount()', function() {
    it('should proxy discount', function() {
      var track = new Track({ properties: { discount: 'discount' } });
      assert.strictEqual(track.discount(), 'discount');
    });
  });

  describe('.products()', function() {
    it('should proxy products', function() {
      var track = new Track({ properties: { products: [{}] } });
      assert.deepEqual(track.products(), [{}]);
    });

    it('should return array', function() {
      var track = new Track({});
      assert.strictEqual(Object.prototype.toString.call(track.products()), '[object Array]');
    });

    it('should always return an array', function() {
      var track = new Track({ properties: { products: 'products' } });
      assert.deepEqual(track.products(), []);
    });

    it('should lookup products properly', function() {
      var track = new Track({ properties: { Products: [{}] } });
      assert.deepEqual(track.products(), [{}]);
    });
  });

  describe('.orderId()', function() {
    it('should proxy orderId', function() {
      var track = new Track({ properties: { orderId: 'orderId' } });
      assert.strictEqual(track.orderId(), 'orderId');
    });

    it('should proxy `id`', function() {
      var track = new Track({ properties: { id: 'id' } });
      assert.strictEqual(track.orderId(), 'id');
    });

    it('should proxy `order_id`', function() {
      var track = new Track({ properties: { order_id: 'id' } });
      assert.strictEqual(track.orderId(), 'id');
    });

    it('should respect fallback order: `id` || `orderId` || `order_id`', function() {
      var props = {
        id: '1',
        orderId: '2',
        order_id: '3'
      };
      var track = new Track({ properties: props });
      assert.strictEqual(track.orderId(), '1');
      
      delete props.id;
      var track2 = new Track({ properties: props });
      assert.strictEqual(track2.orderId(), '2');

      delete props.orderId;
      var track3 = new Track({ properties: props });
      assert.strictEqual(track3.orderId(), '3');
    });
  });

  describe('.properties()', function() {
    it('should proxy the properties', function() {
      assert.deepEqual(track.properties(), args.properties);
    });

    it('should respect aliases', function() {
      assert.deepEqual(track.properties({ revenue: 'amount' }), { referrer: 'http://segment.io', email: 'test@segment.io', username: 'calvinfo', amount: 50 });
    });

    it('should traverse isodate', function() {
      var date = new Date(Date.UTC(2013, 9, 5));
      var track = new Track({ properties: { date: '2013-10-05T00:00:00.000Z' } });
      var time = track.properties().date.getTime();
      assert.strictEqual(time, date.getTime());
    });
  });

  describe('.referrer()', function() {
    it('should proxy the referrer', function() {
      assert.strictEqual(track.referrer(), args.properties.referrer);
    });

    it('should proxy context.referrer.url', function() {
      var track = new Track({ context: { referrer: { url: 'url' } } });
      assert.strictEqual(track.referrer(), 'url');
    });

    it('should proxy context.page.referrer', function() {
      var track = new Track({ context: { page: { referrer: 'url' } } });
      assert.strictEqual(track.referrer(), 'url');
    });
  });

  describe('.username()', function() {
    it('should proxy the username', function() {
      assert.strictEqual(track.username(), args.properties.username);
    });

    it('should proxy the username from the userId', function() {
      assert.strictEqual(new Track({ userId: 'aaa' }).username(), 'aaa');
    });

    it('should proxy the username from the sessionId', function() {
      assert.strictEqual(new Track({ sessionId: 'bbb' }).username(), 'bbb');
    });
  });

  describe('.query()', function() {
    it('should proxy the query', function() {
      assert.strictEqual(track.query(), args.options.query);
    });
  });

  describe('.revenue()', function() {
    it('should proxy the revenue', function() {
      assert.strictEqual(track.revenue(), 50);
    });

    it('should return a number', function() {
      var track = new Track({ properties: { revenue: 10 } });
      assert.strictEqual(track.revenue(), 10);
    });

    it('should intelligently convert strings to numbers if possible', function() {
      var track = new Track({ properties: { revenue: '$10' } });
      assert.strictEqual(track.revenue(), 10);
    });

    it('should return undefined for unknown format', function() {
      var track = new Track({ properties: { revenue: '$hello' } });
      assert.strictEqual(track.revenue(), undefined);
    });

    it('should fallback to total, only during "completed order" event', function() {
      var track = new Track({ properties: { total: 75 } });
      assert.strictEqual(track.revenue(), undefined);
      track = new Track({ properties: { total: 75 }, event: 'completed order' });
      assert.strictEqual(track.revenue(), 75);
    });
  });

  describe('.value()', function() {
    it('should proxy value', function() {
      var track = new Track({ properties: { value: 90 } });
      assert.strictEqual(track.value(), 90);
    });
  });

  describe('.email()', function() {
    it('should proxy the email from properties.email', function() {
      assert.strictEqual(track.email(), args.properties.email);
    });

    it('should proxy the email from .userId', function() {
      var track = new Track({ userId: 'test@segment.io' });
      assert.strictEqual(track.email(), 'test@segment.io');
    });

    it('should fall back to context.traits.email', function() {
      var track = new Track({
        event: 'Email Bounced',
        properties: {
          email_id: '18vzF7u3z',
          email_subject: 'First shirt on us!',
          campaign_id: '123',
          campaign_name: 'New Customer Discount'
        },
        context: {
          ip: '67.207.109.102',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36',
          traits: {
            email: 'pgibbons@initech.com'
          }
        }
      });

      assert.strictEqual(track.email(), 'pgibbons@initech.com');
    });
  });

  describe('.cents()', function() {
    it('should return revenue * 100 if available', function() {
      var track = new Track({ properties: { revenue: 9.99 } });
      assert.strictEqual(track.cents(), 999);
    });

    it('should return value if revenue is unavailable', function() {
      var track = new Track({ properties: { value: 9 } });
      assert.strictEqual(track.cents(), 9);
    });

    it('should prefer revenue', function() {
      var track = new Track({
        properties: {
          revenue: 9.99,
          value: 9
        }
      });
      assert.strictEqual(track.cents(), 999);
    });
  });

  describe('.description()', function() {
    it('should return the description', function() {
      var msg = new Track({ properties: { description: 'description' } });
      assert.strictEqual(msg.description(), 'description');
    });
  });

  describe('.plan()', function() {
    it('should return the description', function() {
      var msg = new Track({ properties: { plan: 'plan' } });
      assert.strictEqual(msg.plan(), 'plan');
    });
  });

  describe('.identify()', function() {
    it('should convert track to identify calls', function() {
      var track = new Track(args);
      var identify = track.identify();

      assert.deepEqual(identify.traits(), { id: 'calvin@segment.io', someTrait: 'y' });
    });
  });
});
