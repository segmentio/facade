
var component = require('require-component')(require)
  , clone     = component('clone')
  , Facade    = component('./facade')
  , inherit   = component('inherit')
  , isEmail   = component('is-email')
  , newDate   = component('new-date')
  , trim      = component('trim');


module.exports = Identify;


function Identify (identify) {
  Facade.call(this, identify);
}


inherit(Identify, Facade);


Identify.prototype.action = function () {
  return 'identify';
};


Identify.prototype.userId = Facade.field('userId');
Identify.prototype.sessionId = Facade.field('sessionId');


/**
 * Return traits
 */

Identify.prototype.traits = function () {
  return this.field('traits') || {};
};

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
 * Created Facade, returns a date from created or createdAt variants
 * @return {Date}
 */

Identify.prototype.created = function () {
  var createdProxy   = Facade.proxy('traits.created')
    , createdAtProxy = Facade.proxy('traits.createdAt');

  var created = createdProxy.call(this) || createdAtProxy.call(this);
  if (created) return newDate(created);
};


/**
 * Name facade, pulls name from traits or returns combination of first
 * and last names
 * @return {String}
 */

Identify.prototype.name = function () {
  var name = this.proxy('traits.name');
  if (name) return trim(name);

  var firstName = this.firstName()
    , lastName  = this.lastName();

  if (firstName && lastName) return firstName + ' ' + lastName;
};


/**
 * First Name facade, pulls from traits or splits the name field
 */

Identify.prototype.firstName = function () {
  var firstName = this.proxy('traits.firstName');
  if (firstName) return firstName;

  var name = this.proxy('traits.name');
  if (name) return trim(name).split(' ')[0];
};


/**
 * Last name facade, pulls from traits, or splits the name field
 */

Identify.prototype.lastName = function () {
  var lastName = this.proxy('traits.lastName');
  if (lastName) return lastName;

  var name = this.proxy('traits.name');
  if (!name) return;

  var space = trim(name).indexOf(' ');
  if (space === -1) return '';

  lastName = name.substr(space + 1);
  return trim(lastName);
};


/**
 * Pull the username from traits
 */

Identify.prototype.username = function () {
  return this.proxy('traits.username') || this.userId() || this.sessionId();
};

/**
 * Get description.
 *
 * @return {String}
 */

Identify.prototype.description = function(){
  return this.proxy('traits.description')
    || this.proxy('traits.background');
};

/**
 * Special Traits
 */

Identify.prototype.website = Facade.proxy('traits.website');
Identify.prototype.phone = Facade.proxy('traits.phone');
Identify.prototype.address = Facade.proxy('traits.address');

