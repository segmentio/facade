
var Page = require('..').Page;
var Track = require('..').Track;
var expect = require('expect.js');

describe('Page', function(){

  var obj;
  var page;

  beforeEach(function(){
    obj = {};
    obj.category = 'docs';
    obj.name = 'docs';
    page = new Page(obj);
  })

  describe('.category()', function(){
    it('should proxy category', function(){
      expect(page.category()).to.eql('docs');
    })
  })

  describe('.properties()', function(){
    it('should proxy properties', function(){
      var obj = {};
      var p = new Page({ properties: obj });
      expect(p.properties()).to.eql(obj);
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
        properties: { prop: true },
        category: 'category',
        name: 'name'
      });

      expect(page.track('event')).to.be.a(Track);
      expect(page.track('event').event()).to.eql('event');
      expect(page.track('event').properties()).to.eql({
        category: 'category',
        name: 'name',
        prop: true
      });
    })
  })

})
