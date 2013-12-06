
var Group = require('..').Group;
var expect = require('expect.js');

describe('Group', function(){

  var obj = { userId: '1', groupId: '1', traits: { trait: true } };
  var group = new Group(obj);

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
  });


  describe('.action()', function(){
    it('should return "group"', function(){
      expect(group.action()).to.be('group');
    })
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
      expect(group.traits()).to.eql(obj.traits);
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
