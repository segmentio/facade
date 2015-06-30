var expect = require('expect.js');
var Facade = require('../lib');
var Alias = Facade.Alias;

describe('Alias', function() {
  var alias;

  beforeEach(function() {
    alias = new Alias({
      from: 'from',
      to: 'to'
    });
  });

  describe('.type()', function() {
    var alias = new Alias({});
    it('should have the proper .type()', function() {
      expect(alias.type()).to.eql('alias');
    });

    it('should equal .action()', function() {
      expect(alias.type()).to.eql(alias.action());
    });
  });

  describe('.from()', function() {
    it('should alias .previousId', function() {
      expect(alias.from).to.equal(alias.previousId);
    });

    it('should proxy .from', function() {
      var alias = new Alias({ from: 'x' });
      expect(alias.from()).to.eql('x');
    });

    it('should proxy .previousId', function() {
      var alias = new Alias({ previousId: 'x' });
      expect(alias.from()).to.eql('x');
    });
  });

  describe('.to()', function() {
    it('should alias .userId', function() {
      expect(alias.to).to.equal(alias.userId);
    });

    it('should proxy .to', function() {
      var alias = new Alias({ to: 'x' });
      expect(alias.to()).to.eql('x');
    });

    it('should proxy .userId', function() {
      var alias = new Alias({ userId: 'x' });
      expect(alias.to()).to.eql('x');
    });
  });
});
