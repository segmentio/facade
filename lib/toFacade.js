'use strict';

var track = require('./track');
var identify = require('./identify');
var alias = require('./alias');
var group = require('./group');
var page = require('./page');
var screen = require('./screen');
var facadeDelete = require('./delete');

/**
 * Create the mapping for the facade
 */
var map = {
  track: track,
  identify: identify,
  alias: alias,
  group: group,
  page: page,
  screen: screen,
  delete: facadeDelete, // eslint-disable-line
};

/**
 * Converts the message to a facade object based upon it's `type`. To
 * opt out of cloning of `message`, pass the `clone` option as false.
 *
 * Usage:
 *
 *  ```
 *  var track = toFacade({ type: 'track' }, {
 *    clone: false
 *  })
 *  ```
 *
 * @param {Object} message
 * @param {Object} opts
 * @return {Facade} facade
 */
module.exports = function(message, opts) {
  var type = message.type || message.action;
  if ('function' === typeof type) return message; // eslint-disable-line
  if (!type) throw new Error('message must contain a .type');
  var Facade = map[type.toLowerCase()];
  if (!Facade) throw new Error('unknown type: ' + type);
  return new Facade(message, opts);
};
