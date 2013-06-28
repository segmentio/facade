
var Facade    = require('./facade')
  , component = require('require-component')(require)
  , clone     = component('clone')
  , inherit   = component('inherit')
  , isEmail   = component('is-email')
  , newDate   = component('new-date');


module.exports = Identify;


function Identify (identify) {
  Facade.call(this, identify);
}


inherit(Identify, Facade);


Identify.prototype.action = function () {
  return 'identify';
};


Identify.prototype.userId    = Facade.proxy('userId');
Identify.prototype.sessionId = Facade.proxy('sessionId');
Identify.prototype.traits    = Facade.proxy('traits');

/**
 * Email Facade
 * @return {String}
 */

Identify.prototype.email = function () {
  var traits = this.traits()
    , userId = this.userId();

  if (isEmail(traits.email)) return traits.email;
  if (isEmail(traits.Email)) return traits.Email;
  if (isEmail(userId)) return userId;
};


/**
 * Created Facade
 * @return {Date}
 */

Identify.prototype.created = function () {
  var createdProxy   = Facade.proxy('created', 'traits')
    , createdAtProxy = Facade.proxy('createdAt', 'traits');

  var created = createdProxy.call(this) || createdAtProxy.call(this);
  if (created) return newDate(created);
};


/**
 * Name facade, pulls name from traits or returns combination of first
 * and last names
 * @return {String}
 */

Identify.prototype.name = function () {
  var proxy = Facade.proxy('name', 'traits')
    , name  = proxy.call(this);

  if (name) return name;

  var firstName = this.firstName()
    , lastName  = this.lastName();

  if (firstName && lastName) return firstName + ' ' + lastName;
};


/**
 * Special Traits
 */

Identify.prototype.firstName = Facade.proxy('firstName', 'traits');
Identify.prototype.lastName  = Facade.proxy('lastName',  'traits');
Identify.prototype.website   = Facade.proxy('website',   'traits');
Identify.prototype.phone     = Facade.proxy('phone',     'traits');
Identify.prototype.address   = Facade.proxy('address',   'traits');

