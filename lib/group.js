var Facade    = require('./facade')
  , component = require('require-component')(require)
  , inherit   = component('inherit');


module.exports = Group;


function Group (group) {
  Facade.call(this, group);
}


inherit(Group, Facade);


Group.prototype.action = function () {
  return 'group';
};


Group.prototype.traits  = Facade.field('traits');
Group.prototype.groupId = Facade.field('groupId');
Group.prototype.userId  = Facade.field('userId');

/**
 * Get traits or properties.
 *
 * TODO: remove me
 *
 * @return {Object}
 */

Group.prototype.properties = function(){
  return this.traits() || this.field('properties');
};
