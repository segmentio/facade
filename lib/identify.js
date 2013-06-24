
var clone   = require('clone')
  , Facade  = require('./facade')
  , inherit = require('inherit')
  , isEmail = require('is-email')
  , newDate = require('new-date');


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
 * Special Traits
 */

Identify.prototype.firstName = Facade.proxy('firstName', 'traits');
Identify.prototype.lastName  = Facade.proxy('lastName',  'traits');
Identify.prototype.website   = Facade.proxy('website',   'traits');
Identify.prototype.phone     = Facade.proxy('phone',     'traits');
Identify.prototype.address   = Facade.proxy('address',   'traits');

