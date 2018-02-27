'use strict';

var Delete = require('../lib').Delete;
var assert = require('assert');

describe('Delete', function() {
  var obj = {
    userId: '1'
  };
  var delete_ = new Delete(obj);  // delete is a reserved keyword in js

  describe('.type()', function() {
    it('should have the proper .type()', function() {
      assert.strictEqual(delete_.type(), 'delete');
    });
  });

  describe('.userId()', function() {
    it('should proxy the userId', function() {
      assert.deepEqual(delete_.userId(), obj.userId);
    });
  });
});
