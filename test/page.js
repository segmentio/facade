
var Page = require('../lib').Page;
var Track = require('../lib').Track;
var expect = require('expect.js');

describe('Page', function(){

  var obj;
  var page;

  beforeEach(function(){
    obj = {};
    obj.userId = 2;
    obj.sessionId = 3;
    obj.category = 'docs';
    obj.name = 'docs';
    page = new Page(obj);
  })

  describe('.type()', function(){
    it('should have the proper .type()', function(){
      expect(page.type()).to.eql('page');
    });

    it('should equal .action()', function(){
      expect(page.type()).to.eql(page.action());
    });
  });

  describe('.category()', function(){
    it('should proxy category', function(){
      expect(page.category()).to.eql('docs');
    })
  })

  describe('.userId()', function(){
    it('should proxy the userId', function(){
      expect(page.userId()).to.eql(obj.userId);
    });
  });

  describe('.sessionId()', function(){
    it('should proxy the sessionId', function(){
      expect(page.sessionId()).to.eql(obj.sessionId);
    });
  });

  describe('.properties()', function(){
    it('should proxy properties', function(){
      var obj = {};
      var p = new Page({ properties: obj });
      expect(p.properties()).to.eql(obj);
    })

    it('should default to an empty object if properties is undefined', function(){
      var page = new Page({});
      expect(page.properties()).to.eql({});
    })

    it('should mixin category and name', function(){
      var page = new Page({
        properties: { prop: true },
        category: 'category',
        name: 'name',
      });

      expect(page.properties()).to.eql({
        category: 'category',
        name: 'name',
        prop: true
      });
    })
  })

  describe('.name()', function(){
    it('should proxy name', function(){
      expect(page.name()).to.eql(obj.name);
    })
  })

  describe('.event()', function(){
    it('should concat name if given', function(){
      var page = new Page({});
      expect(page.event('baz')).to.eql('Viewed baz Page');
    })

    it('should return "Loaded a Page" if name is omitted', function(){
      expect(new Page({}).event()).to.eql('Loaded a Page');
    })
  })

  describe('.track()', function(){
    it('should convert the page to track with event', function(){
      var page = new Page({
        timestamp: new Date('2014-01-01'),
        properties: { prop: true },
        category: 'category',
        name: 'name'
      });

      expect(page.track('event')).to.be.a(Track);
      expect(page.track().event()).to.eql('Loaded a Page');
      expect(page.track('name').event()).to.eql('Viewed name Page');
      expect(page.track('category').event()).to.eql('Viewed category Page');
      expect(page.track('category').event()).to.eql('Viewed category Page');
      expect(page.track('category').timestamp()).to.eql(page.timestamp());
      expect(page.track('event').properties()).to.eql({
        category: 'category',
        name: 'name',
        prop: true
      });
    })
  })

  describe('.fullName()', function(){
    it('should return only name if category is omitted', function(){
      var page = new Page({
        name: 'baz'
      });

      expect(page.fullName()).to.eql('baz');
    })

    it('should return the category + name if available', function(){
      var page = new Page({
        category: 'cat',
        name: 'baz'
      });

      expect(page.fullName()).to.eql('cat baz');
    })
  })

})
