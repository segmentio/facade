'use strict';

var Facade = require('./facade');
var isEmail = require('is-email');
var newDate = require('new-date');
var utils = require('./utils');
var get = require('obj-case');
var trim = require('trim');
var inherit = utils.inherit;
var type = utils.type;

/**
 * Initialize a new `Identify` facade with a `dictionary` of arguments.
 *
 * @param {Object} dictionary
 *   @param {string} userId
 *   @param {string} sessionId
 *   @param {Object} traits
 *   @param {Object} options
 * @param {Object} opts
 *   @property {boolean|undefined} clone
 */
function Identify(dictionary, opts) {
  Facade.call(this, dictionary, opts);
}

/**
 * Inherit from `Facade`.
 */

inherit(Identify, Facade);

/**
 * Get the facade's action.
 */
Identify.prototype.action = function() {
  return 'identify';
};

Identify.prototype.type = Identify.prototype.action;

/**
 * Get the user's traits.
 *
 * @param {Object} aliases
 * @return {Object}
 */
Identify.prototype.traits = function(aliases) {
  var ret = this.field('traits') || {};
  var id = this.userId();
  aliases = aliases || {};

  if (id) ret.id = id;

  for (var alias in aliases) {
    var value = this[alias] == null ? this.proxy('traits.' + alias) : this[alias]();
    if (value == null) continue;
    ret[aliases[alias]] = value;
    if (alias !== aliases[alias]) delete ret[alias];
  }

  return ret;
};

/**
 * Get the user's email, falling back to their user ID if it's a valid email.
 *
 * @return {string}
 */
Identify.prototype.email = function() {
  var email = this.proxy('traits.email');
  if (email) return email;

  var userId = this.userId();
  if (isEmail(userId)) return userId;
};

/**
 * Get the user's created date, optionally looking for `createdAt` since lots of
 * people do that instead.
 *
 * @return {Date or Undefined}
 */
Identify.prototype.created = function() {
  var created = this.proxy('traits.created') || this.proxy('traits.createdAt');
  if (created) return newDate(created);
};

/**
 * Get the company created date.
 *
 * @return {Date or undefined}
 */
Identify.prototype.companyCreated = function() {
  var created = this.proxy('traits.company.created') || this.proxy('traits.company.createdAt');

  if (created) {
    return newDate(created);
  }
};

/**
 * Get the user's name, optionally combining a first and last name if that's all
 * that was provided.
 *
 * @return {string|undefined}
 */
Identify.prototype.name = function() {
  var name = this.proxy('traits.name');
  if (typeof name === 'string') {
    return trim(name);
  }

  var firstName = this.firstName();
  var lastName = this.lastName();
  if (firstName && lastName) {
    return trim(firstName + ' ' + lastName);
  }
};

/**
 * Get the user's first name, optionally splitting it out of a single name if
 * that's all that was provided.
 *
 * @return {string|undefined}
 */
Identify.prototype.firstName = function() {
  var firstName = this.proxy('traits.firstName');
  if (typeof firstName === 'string') {
    return trim(firstName);
  }

  var name = this.proxy('traits.name');
  if (typeof name === 'string') {
    return trim(name).split(' ')[0];
  }
};

/**
 * Get the user's last name, optionally splitting it out of a single name if
 * that's all that was provided.
 *
 * @return {string|undefined}
 */
Identify.prototype.lastName = function() {
  var lastName = this.proxy('traits.lastName');
  if (typeof lastName === 'string') {
    return trim(lastName);
  }

  var name = this.proxy('traits.name');
  if (typeof name !== 'string') {
    return;
  }

  var space = trim(name).indexOf(' ');
  if (space === -1) {
    return;
  }

  return trim(name.substr(space + 1));
};

/**
 * Get the user's unique id.
 *
 * @return {string|undefined}
 */
Identify.prototype.uid = function() {
  return this.userId() || this.username() || this.email();
};

/**
 * Get description.
 *
 * @return {string}
 */
Identify.prototype.description = function() {
  return this.proxy('traits.description') || this.proxy('traits.background');
};

/**
 * Get the age.
 *
 * If the age is not explicitly set
 * the method will compute it from `.birthday()`
 * if possible.
 *
 * @return {number}
 */
Identify.prototype.age = function() {
  var date = this.birthday();
  var age = get(this.traits(), 'age');
  if (age != null) return age;
  if (type(date) !== 'date') return;
  var now = new Date();
  return now.getFullYear() - date.getFullYear();
};

/**
 * Get the avatar.
 *
 * .photoUrl needed because help-scout
 * implementation uses `.avatar || .photoUrl`.
 *
 * .avatarUrl needed because trakio uses it.
 *
 * @return {*}
 */
Identify.prototype.avatar = function() {
  var traits = this.traits();
  return get(traits, 'avatar') || get(traits, 'photoUrl') || get(traits, 'avatarUrl');
};

/**
 * Get the position.
 *
 * .jobTitle needed because some integrations use it.
 *
 * @return {*}
 */
Identify.prototype.position = function() {
  var traits = this.traits();
  return get(traits, 'position') || get(traits, 'jobTitle');
};

/**
 * Setup sme basic "special" trait proxies.
 */

Identify.prototype.username = Facade.proxy('traits.username');
Identify.prototype.website = Facade.one('traits.website');
Identify.prototype.websites = Facade.multi('traits.website');
Identify.prototype.phone = Facade.one('traits.phone');
Identify.prototype.phones = Facade.multi('traits.phone');
Identify.prototype.address = Facade.proxy('traits.address');
Identify.prototype.gender = Facade.proxy('traits.gender');
Identify.prototype.birthday = Facade.proxy('traits.birthday');

/**
 * Exports.
 */

module.exports = Identify;
