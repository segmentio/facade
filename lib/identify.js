
var clone   = require('clone')
  , Facade  = require('./facade')
  , inherit = require('inherit')
  , isEmail = require('is-email');


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


Identify.prototype.email = function () {
  var traits = this.traits()
    , userId = this.userId();

  if (isEmail(traits.email)) return traits.email;
  if (isEmail(traits.Email)) return traits.Email;
  if (isEmail(userId)) return userId;
};
