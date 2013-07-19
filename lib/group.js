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


Group.prototype.properties = Facade.field('properties');
Group.prototype.groupId    = Facade.field('groupId');
Group.prototype.userId     = Facade.field('userId');