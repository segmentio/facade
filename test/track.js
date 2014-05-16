var Track = require('..').Track;
var expect = require('expect.js');

describe('Track', function(){

  var args = {
    userId     : 'calvin@segment.io',
    sessionId  : 'abc123',
    properties : {
      revenue  : '$50',
      referrer : 'http://segment.io',
      username : 'calvinfo',
      email    : 'test@segment.io'
    },
    options : {
      query  : 'segmentio',
      traits : {
        someTrait: 'y'
      }
    }
  };

  var track = new Track(args);

  describe('.type()', function(){
    it('should have the proper .type()', function(){
      expect(track.type()).to.eql('track');
    });

    it('should equal .action()', function(){
      expect(track.type()).to.eql(track.action());
    });
  });

  describe('.userId()', function(){
    it('should proxy the userId', function(){
      expect(track.userId()).to.eql(args.userId);
    });
  });

  describe('.sessionId()', function(){
    it('should proxy the sessionId', function(){
      expect(track.sessionId()).to.eql(args.sessionId);
    });
  });

  describe('.event()', function(){
    it('should proxy the event', function(){
      expect(track.event()).to.eql(args.event);
    });
  });

  describe('.quantity()', function(){
    it('should return the quantity', function(){
      var track = new Track({ properties: { quantity: 2 } });
      expect(track.quantity()).to.eql(2);
    })

    it('should default quantity to 1', function(){
      var track = new Track({});
      expect(track.quantity()).to.eql(1);
    })
  })

  describe('.currency()', function(){
    it('should return the currency code', function(){
      var track = new Track({ properties: { currency: 'EUR' } });
      expect(track.currency()).to.eql('EUR');
    })

    it('should default currency to `USD`', function(){
      var track = new Track({});
      expect(track.currency()).to.eql('USD');
    })
  })

  describe('.subtotal()', function(){
    it('should get subtotal', function(){
      var track = new Track({ properties: { subtotal: 10 }});
      expect(track.subtotal()).to.eql(10);
    })

    it('should compute subtotal from total', function(){
      var track = new Track({ properties: { total: 10, tax: 2, shipping: 2 } });
      expect(track.subtotal()).to.eql(6);
    })
  })

  describe('.category()', function(){
    it('should proxy category', function(){
      var track = new Track({ properties: { category: 'category' } });
      expect(track.category()).to.eql('category');
    })
  })

  describe('.state()', function(){
    it('should proxy state', function(){
      var track = new Track({ properties: { state: 'state' } });
      expect(track.state()).to.eql('state');
    })
  })

  describe('.city()', function(){
    it('should proxy city', function(){
      var track = new Track({ properties: { city: 'city' } });
      expect(track.city()).to.eql('city');
    })
  })

  describe('.zip()', function(){
    it('should proxy zip', function(){
      var track = new Track({ properties: { zip: 'zip' } });
      expect(track.zip()).to.eql('zip');
    })
  })

  describe('.tax()', function(){
    it('should proxy tax', function(){
      var track = new Track({ properties: { tax: 'tax' } });
      expect(track.tax()).to.eql('tax');
    })
  })

  describe('.name()', function(){
    it('should proxy name', function(){
      var track = new Track({ properties: { name: 'name' } });
      expect(track.name()).to.eql('name');
    })
  })

  describe('.country()', function(){
    it('should proxy country', function(){
      var track = new Track({ properties: { country: 'country' } });
      expect(track.country()).to.eql('country');
    })
  })

  describe('.price()', function(){
    it('should proxy price', function(){
      var track = new Track({ properties: { price: 'price' } });
      expect(track.price()).to.eql('price');
    })
  })

  describe('.total()', function(){
    it('should proxy total', function(){
      var track = new Track({ properties: { total: 'total' } });
      expect(track.total()).to.eql('total');
    })
  })

  describe('.coupon()', function(){
    it('should proxy coupon', function(){
      var track = new Track({ properties: { coupon: 'coupon' } });
      expect(track.coupon()).to.eql('coupon');
    })
  })

  describe('.shipping()', function(){
    it('should proxy shipping', function(){
      var track = new Track({ properties: { shipping: 'shipping' } });
      expect(track.shipping()).to.eql('shipping');
    })
  })

  describe('.products()', function(){
    it('should proxy products', function(){
      var track = new Track({ properties: { products: 'products' } });
      expect(track.products()).to.eql('products');
    })

    it('should return array', function(){
      var track = new Track({});
      expect(track.products()).to.be.an('array');
    })
  })

  describe('.orderId()', function(){
    it('should proxy orderId', function(){
      var track = new Track({ properties: { orderId: 'orderId' } });
      expect(track.orderId()).to.eql('orderId');
    })

    it('should proxy `id`', function(){
      var track = new Track({ properties: { id: 'id' } });
      expect(track.orderId()).to.eql('id');
    })
  })

  describe('.properties()', function(){
    it('should proxy the properties', function(){
      expect(track.properties()).to.eql(args.properties);
    });

    it('should respect aliases', function(){
      expect(track.properties({ revenue: 'amount' })).to.eql({
        referrer: 'http://segment.io',
        email: 'test@segment.io',
        username: 'calvinfo',
        amount: 50
      });
    })

    it('should traverse isodate', function(){
      var date = new Date(Date.UTC(2013, 9, 5));
      var track = new Track({ properties: { date: '2013-10-05T00:00:00.000Z' } });
      var time = track.properties().date.getTime();
      expect(time).to.equal(date.getTime());
    })
  });

  describe('.referrer()', function(){
    it('should proxy the referrer', function(){
      expect(track.referrer()).to.eql(args.properties.referrer);
    });
  });

  describe('.username()', function(){
    it('should proxy the username', function(){
      expect(track.username()).to.eql(args.properties.username);
    });

    it('should proxy the username from the userId', function(){
      expect(new Track({ userId : 'aaa' }).username()).to.eql('aaa');
    });

    it('should proxy the username from the sessionId', function(){
      expect(new Track({ sessionId : 'bbb' }).username()).to.eql('bbb');
    });
  });

  describe('.query()', function(){
    it('should proxy the query', function(){
      expect(track.query()).to.eql(args.options.query);
    });
  });

  describe('.revenue()', function(){
    it('should proxy the revenue', function(){
      expect(track.revenue()).to.eql(50);
    });

    it('should fallback to total', function(){
      var track = new Track({ properties: { total: '$75' } });
      expect(track.revenue()).to.eql(75);
    });
  });

  describe('.value()', function(){
    it('should proxy value', function(){
      var track = new Track({ properties: { value: 90 } });
      expect(track.value()).to.eql(90);
    })
  })

  describe('.email()', function(){
    it('should proxy the email from properties.email', function(){
      expect(track.email()).to.eql(args.properties.email);
    })

    it('should proxy the email from .userId', function(){
      var track = new Track({ userId: 'test@segment.io' });
      expect(track.email()).to.eql('test@segment.io');
    });
  });

  describe('.traits()', function(){
    it('should proxy the traits', function(){
      expect(track.traits()).to.eql(args.options.traits);
    });

    it('should return an empty object with no traits', function(){
      var track = new Track({});
      expect(track.traits()).to.eql({});
    });
  });

  describe('.cents()', function(){
    it('should return revenue * 100 if available', function(){
      var track = new Track({ properties: { revenue: 9.99 } });
      expect(track.cents()).to.eql(999);
    })

    it('should return value if revenue is unavailable', function(){
      var track = new Track({ properties: { value: 9 } });
      expect(track.cents()).to.eql(9);
    })

    it('should prefer revenue', function(){
      var track = new Track({
        properties: {
          revenue: 9.99,
          value: 9
        }
      });
      expect(track.cents()).to.eql(999);
    })
  })

  describe('.identify()', function(){
    it('should convert track to identify calls', function(){
      var track = new Track(args);
      var identify = track.identify();

      expect(identify.traits()).to.eql({
        id: 'calvin@segment.io',
        someTrait: 'y'
      });
    });
  });
});
