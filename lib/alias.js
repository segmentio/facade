
/**
 * Module dependencies.
 */

var inherit = require('./utils').inherit;
var Facade = require('./facade');

/**
 * Expose `Alias` facade.
 */

module.exports = Alias;

/**
 * Initialize a new `Alias` facade with a `dictionary` of arguments.
 *
 * @param {Object} dictionary
 *   @property {String} from
 *   @property {String} to
 *   @property {Object} options
 * @param {Object} opts
 *   @property {Boolean|Undefined} clone
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
 * @return {String}
 */

Alias.prototype.action = function() {
  return 'alias';
};

Alias.prototype.type = Alias.prototype.action;

/**
 * Get `previousId`.
 *
 * @return {Mixed}
 * @api public
 */

Alias.prototype.previousId = function() {
  return this.field('previousId')
    || this.field('from');
};

Alias.prototype.from = Alias.prototype.previousId;

/**
 * Get `userId`.
 *
 * @return {String}
 * @api public
 */

Alias.prototype.userId = function() {
  return this.field('userId')
    || this.field('to');
};

Alias.prototype.to = Alias.prototype.userId;
