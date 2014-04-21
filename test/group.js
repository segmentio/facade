
var Group = require('..').Group;
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
})
