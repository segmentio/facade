
var Page = require('..').Page;
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
  })

  describe('.name()', function(){
    it('should proxy name', function(){
      expect(page.name()).to.eql(obj.name);
    })
  })

})
