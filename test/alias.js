'use strict';

var Alias = require('../lib').Alias;
var Facade = require('../lib');
var assert = require('proclaim');

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
      assert.deepEqual(alias.type(), 'alias');
    });

    it('should equal .action()', function() {
      assert.deepEqual(alias.type(), alias.action());
    });
  });

  describe('.from()', function() {
    it('should alias .previousId', function() {
      assert.strictEqual(alias.from, alias.previousId);
    });

    it('should proxy .from', function() {
      var alias = new Alias({ from: 'x' });
      assert.deepEqual(alias.from(), 'x');
    });

    it('should proxy .previousId', function() {
      var alias = new Alias({ previousId: 'x' });
      assert.deepEqual(alias.from(), 'x');
    });
  });

  describe('.to()', function() {
    it('should alias .userId', function() {
      assert.strictEqual(alias.to, alias.userId);
    });

    it('should proxy .to', function() {
      var alias = new Alias({ to: 'x' });
      assert.deepEqual(alias.to(), 'x');
    });

    it('should proxy .userId', function() {
      var alias = new Alias({ userId: 'x' });
      assert.deepEqual(alias.to(), 'x');
    });
  });
});
