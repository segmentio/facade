
var Group = require('..').Group;
var expect = require('expect.js');

describe('Group', function(){

  var obj = {
    traits: { trait: true },
    groupId: '123',
    userId: '123'
  };

  var group;

  beforeEach(function(){
    group = new Group({
      groupId: '123',
      userId: '123',
      traits: { trait: true }
    })
  })

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
