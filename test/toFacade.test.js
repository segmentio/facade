'use strict';

var assert = require('assert');
var convert = require('../lib/toFacade');
var facade = require('../');

describe('to-facade', function() {
  /**
   * Verify that the converted object is actually the kind we want
   */

  function verify(method) {
    assert(convert({ action: method }).action() === method.toLowerCase());
    assert(convert({ type: method }).type() === method.toLowerCase());
  }

  /**
   * Verify that facade isn't converted
   */

  function converted(method) {
    method = method[0].toUpperCase() + method.slice(1);
    var Facade = facade[method];
    var msg = new Facade({});
    assert(msg == convert(msg)); // eslint-disable-line
  }

  it('should convert upper-cased types', function() {
    verify('Track');
    verify('Alias');
    verify('Identify');
    verify('Page');
    verify('Group');
    verify('Screen');
  });

  it('should convert lower-cased types', function() {
    verify('track');
    verify('alias');
    verify('identify');
    verify('page');
    verify('group');
    verify('screen');
  });

  it('should not convert existing facades', function() {
    converted('track');
    converted('alias');
    converted('identify');
    converted('page');
    converted('group');
    converted('screen');
  });

  it('should throw an error on an invalid type', function() {
    try {
      convert({ type: 'foo' });
    } catch (err) {
      assert(err.message === 'unknown type: foo');
      return;
    }
    throw new Error('did not throw an error');
  });

  it('should throw an error on a missing type', function() {
    try {
      convert({});
    } catch (err) {
      assert(err.message === 'message must contain a .type');
      return;
    }
    throw new Error('did not throw an error');
  });
});
