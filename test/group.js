
var Group = require('../lib').Group;
var expect = require('expect.js');

describe('Group', function(){
  var obj = {
    userId: '1',
    sessionId: '2',
    groupId: '1',
    traits: {
      trait: true
    }
  };
  var group = new Group(obj);

  describe('.type()', function(){
    it('should have the proper .type()', function(){
      expect(group.type()).to.be('group');
    });

    it('should equal .action()', function(){
      expect(group.type()).to.eql(group.action());
    });
  });

  describe('.groupId()', function(){
    it('should proxy the group id', function(){
      expect(group.groupId()).to.eql(obj.groupId);
    })
  })

  describe('.properties()', function(){
    it('should proxy properties', function(){
      var obj = {};
      var g = new Group({ properties: obj });
      expect(g.properties()).to.eql(obj);
    })
  })

  describe('.userId()', function () {
    it('should proxy the userId', function () {
      expect(group.userId()).to.eql(obj.userId);
    });
  });

  describe('.sessionId()', function () {
    it('should proxy the sessionId', function () {
      expect(group.sessionId()).to.eql(obj.sessionId);
    });
  });

  describe('.created()', function(){
    var at = new Date;

    it('should proxy created', function(){
      var opts = { traits: { created: at } };
      var g = new Group(opts);
      expect(g.created()).to.eql(at);
    })

    it('should proxy createdAt', function(){
      var opts = { traits: { createdAt: at } };
      var g = new Group(opts);
      expect(g.created()).to.eql(at);
    })

    it('should turn strings into dates', function(){
      var str = '2013-07-18T23:58:38.555Z';
      var g = new Group({ properties: { created: str } });
      expect(g.created()).to.eql(new Date(str));
    })

    it('should return undefined if date was not found', function(){
      var group = new Group({ properties: {} });
      expect(group.created()).to.eql(undefined);
    })
  });

  describe('.type()', function(){
    it('should return "group"', function(){
      expect(group.type()).to.be('group');
    })

    it('should respond to .action()', function(){
      expect(group.action()).to.be('group');
    });
  })

  describe('.groupId()', function(){
    it('should proxy the groupId', function(){
      expect(group.groupId()).to.eql(obj.userId);
    })
  })

  describe('.userId()', function(){
    it('should proxy the userId', function(){
      expect(group.userId()).to.eql(obj.userId);
    })
  })

  describe('.traits()', function(){
    it('should proxy traits', function(){
      expect(group.traits()).to.eql({ trait: true, id: '1' });
    })

    it('should return an empty object if traits is undefined', function(){
      expect(new Group({}).traits()).to.eql({});
    })

    it('should respect aliases', function(){
      var group = new Group({ traits: { a: 1, b: 2 } });
      expect(group.traits({ a: 1 })).to.eql({ 1: 1, b: 2 });
    })
  })

  describe('.properties()', function(){
    it('should proxy traits', function(){
      expect(group.properties()).to.eql(obj.traits);
    })

    it('should proxy properties if theres no traits', function(){
      var group = new Group({ properties: { prop: true } });
      expect(group.properties()).to.eql({ prop: true });
    })
  })

  describe('.city()', function(){
    it('should pull from traits.address.city', function(){
      var msg = new Group({ traits: {
        address: { city: 'city' }
      }});
      expect(msg.city()).to.eql('city');
    });

    it('should pull from traits.city', function(){
      var msg = new Group({ traits: { city: 'city' } });
      expect(msg.city()).to.eql('city');
    });
  });

  describe('.country()', function(){
    it('should pull from traits.address.country', function(){
      var msg = new Group({ traits: {
        address: { country: 'country' }
      }});
      expect(msg.country()).to.eql('country');
    });

    it('should pull from traits.country', function(){
      var msg = new Group({ traits: { country: 'country' } });
      expect(msg.country()).to.eql('country');
    });
  });

  describe('.state()', function(){
    it('should pull from traits.address.state', function(){
      var msg = new Group({ traits: {
        address: { state: 'state' }
      }});
      expect(msg.state()).to.eql('state');
    });

    it('should pull from traits.state', function(){
      var msg = new Group({ traits: { state: 'state' } });
      expect(msg.state()).to.eql('state');
    });
  });

  describe('.street()', function(){
    it('should pull from traits.address.street', function(){
      var msg = new Group({ traits: {
        address: { street: 'street' }
      }});
      expect(msg.street()).to.eql('street');
    });

    it('should pull from traits.street', function(){
      var msg = new Group({ traits: { street: 'street' } });
      expect(msg.street()).to.eql('street');
    });
  });

  describe('.zip()', function(){
    it('should pull from traits.address.zip', function(){
      var msg = new Group({ traits: {
        address: { zip: 'zip' }
      }});
      expect(msg.zip()).to.eql('zip');
    });

    it('should pull from traits.zip', function(){
      var msg = new Group({ traits: { zip: 'zip' } });
      expect(msg.zip()).to.eql('zip');
    });

    it('should pull from traits.address.postalCode', function(){
      var msg = new Group({ traits: {
        address: { postalCode: 'postalCode' }
      }});
      expect(msg.zip()).to.eql('postalCode');
    });

    it('should pull from traits.postalCode', function(){
      var msg = new Group({ traits: { postalCode: 'postalCode' } });
      expect(msg.zip()).to.eql('postalCode');
    });
  });

  describe('.employees()', function(){
    it('should proxy employees', function(){
      var msg = new Group({ traits: { employees: 50 } });
      expect(msg.employees()).to.eql(50);
    });
  });

  describe('.industry()', function(){
    it('should proxy industry', function(){
      var msg = new Group({ traits: { industry: 'tech' } });
      expect(msg.industry()).to.eql('tech');
    });
  });

  describe('.name()', function(){
    it('should proxy name', function(){
      var msg = new Group({ traits: { name: 'tech' } });
      expect(msg.name()).to.eql('tech');
    });
  });

  describe('.email()', function(){
    it('should proxy email', function(){
      var msg = new Group({ traits: { email: 'email@example.com' } });
      expect(msg.email()).to.eql('email@example.com');
    });

    it('should fallback to .groupId if its a valid email', function(){
      var msg = new Group({ groupId: 'email@example.com' });
      expect(msg.email()).to.eql('email@example.com');
    });

    it('should not return the .groupId if its an invalid email', function(){
      var msg = new Group({ groupId: 23 });
      expect(msg.email()).to.eql(undefined);
    });
  });
});
