var expect = require('expect.js')
  , Facade = require('../')
  , Alias = Facade.Alias;


describe('Alias', function () {

  describe('.action()', function () {
    it('should have the right action', function () {
      var alias = new Alias({});
      expect(alias.action()).to.eql('alias');
    });
  });


  describe('.from()', function () {
    it('should proxy .from', function () {
      var alias = new Alias({ from : 'x' });
      expect(alias.from()).to.eql('x');
    });
  });

  describe('.to()', function () {
    it('should proxy .to', function () {
      var alias = new Alias({ to : 'x' });
      expect(alias.to()).to.eql('x');
    });
  });

});
