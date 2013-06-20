
var clone   = require('clone')
  , isEmail = require('isEmail');


module.exports = Identify;


function Identify (identify) {
  this.identify = identify;
}


Identify.prototype.userId  = proxy('userId');
Identify.prototype.traits  = proxy('traits');
Identify.prototype.channel = proxy('channel');


Identify.prototype.action = function () {
  return 'identify';
};


Identify.prototype.json  = function () {
  return clone(this.identify);
};


Identify.prototype.options = function () {
  return clone(this.identify.options || this.identify.context);
};


Identify.prototype.email = function () {
  var traits = this.traits()
    , userId = this.userId();

  if (isEmail(traits.email)) return traits.email;
  if (isEmail(traits.Email)) return traits.Email;
  if (isEmail(userId)) return userId;
};


function proxy (name) {
  return function () { return clone(this.identify[name]); };
}