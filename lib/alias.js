'use strict';

/**
 * Module dependencies.
 */

var inherit = require('./utils').inherit;
var Facade = require('./facade');

/**
 * Initialize a new `Alias` facade with a `dictionary` of arguments.
 *
 * @param {Object} dictionary
 *   @property {string} from
 *   @property {string} to
 *   @property {Object} options
 * @param {Object} opts
 *   @property {boolean|undefined} clone
 */
function Alias(dictionary, opts) {
  Facade.call(this, dictionary, opts);
}

/**
 * Inherit from `Facade`.
 */

inherit(Alias, Facade);

/**
 * Return type of facade.
 *
 * @return {string}
 */
Alias.prototype.action = function() {
  return 'alias';
};

Alias.prototype.type = Alias.prototype.action;

/**
 * Get `previousId`.
 *
 * @api public
 * @return {*}
 */
Alias.prototype.previousId = function() {
  return this.field('previousId') || this.field('from');
};

Alias.prototype.from = Alias.prototype.previousId;

/**
 * Get `userId`.
 *
 * @api public
 * @return {string}
 */
Alias.prototype.userId = function() {
  return this.field('userId') || this.field('to');
};

Alias.prototype.to = Alias.prototype.userId;

/**
 * Exports.
 */

module.exports = Alias;
