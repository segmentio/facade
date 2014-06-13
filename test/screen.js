
var Screen = require('../lib').Screen;
var Track = require('../lib').Track;
var expect = require('expect.js');

describe('Screen', function(){

  var obj;
  var screen;

  beforeEach(function(){
    obj = {};
    obj.userId = 2;
    obj.sessionId = 3;
    obj.category = 'songs';
    obj.name = 'ab frank';
    screen = new Screen(obj);
  })

  describe('.type()', function(){
    it('should have the proper .type()', function(){
      expect(screen.type()).to.eql('screen');
    });

    it('should equal .action()', function(){
      expect(screen.type()).to.eql(screen.action());
    });
  });

  describe('.category()', function(){
    it('should proxy category', function(){
      expect(screen.category()).to.eql('songs');
    })
  })

  describe('.userId()', function(){
    it('should proxy the userId', function(){
      expect(screen.userId()).to.eql(obj.userId);
    });
  });

  describe('.sessionId()', function(){
    it('should proxy the sessionId', function(){
      expect(screen.sessionId()).to.eql(obj.sessionId);
    });
  });

  describe('.properties()', function(){
    it('should proxy properties', function(){
      var obj = {};
      var p = new Screen({ properties: obj });
      expect(p.properties()).to.eql(obj);
    })

    it('should default to an empty object if properties is undefined', function(){
      var screen = new Screen({});
      expect(screen.properties()).to.eql({});
    })

    it('should mixin category and name', function(){
      var screen = new Screen({
        properties: { prop: true },
        category: 'category',
        name: 'name',
      });

      expect(screen.properties()).to.eql({
        category: 'category',
        name: 'name',
        prop: true
      });
    })
  })

  describe('.name()', function(){
    it('should proxy name', function(){
      expect(screen.name()).to.eql(obj.name);
    })
  })

  describe('.event()', function(){
    it('should concat name if given', function(){
      var screen = new Screen({});
      expect(screen.event('baz')).to.eql('Viewed baz Screen');
    })

    it('should return "Loaded a Screen" if name is omitted', function(){
      expect(new Screen({}).event()).to.eql('Loaded a Screen');
    })
  })

  describe('.track()', function(){
    it('should convert the screen to track with event', function(){
      var screen = new Screen({
        properties: { prop: true },
        category: 'category',
        name: 'name'
      });

      expect(screen.track('event')).to.be.a(Track);
      expect(screen.track().event()).to.eql('Loaded a Screen');
      expect(screen.track('name').event()).to.eql('Viewed name Screen');
      expect(screen.track('category').event()).to.eql('Viewed category Screen');
      expect(screen.track('event').properties()).to.eql({
        category: 'category',
        name: 'name',
        prop: true
      });
    })
  })

  describe('.fullName()', function(){
    it('should return only name if category is omitted', function(){
      var screen = new Screen({
        name: 'baz'
      });

      expect(screen.fullName()).to.eql('baz');
    })

    it('should return the category + name if available', function(){
      var screen = new Screen({
        category: 'cat',
        name: 'baz'
      });

      expect(screen.fullName()).to.eql('cat baz');
    })
  })
})
