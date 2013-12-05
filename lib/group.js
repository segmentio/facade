
var Facade = require('./facade');
var component = require('require-component')(require);
var inherit = component('inherit');
var newDate = component('new-date');

/**
 * Expose `Group` facade.
 */

module.exports = Group;

/**
 * Initialize a new `Group` facade with a `dictionary` of arguments.
 *
 * @param {Object} dictionary
 *   @param {String} userId
 *   @param {String} groupId
 *   @param {Object} properties
 *   @param {Object} options
 */

function Group (dictionary) {
  Facade.call(this, dictionary);
}

/**
 * Inherit from `Facade`
 */

inherit(Group, Facade);

/**
 * Get the facade's action.
 */

Group.prototype.action = function () {
  return 'group';
};

/**
 * Setup some basic proxies.
 */

Group.prototype.properties = Facade.field('properties');
Group.prototype.groupId = Facade.field('groupId');
Group.prototype.userId = Facade.field('userId');

/**
 * Get the group's created date.
 *
 * @return {Date or undefined}
 */

Group.prototype.created = function(){
  return newDate(this.proxy('properties.created')
    || this.proxy('properties.createdAt'));
};
