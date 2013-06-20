var clone = require('clone');


module.exports = Alias;


function Alias(alias) {
  this.alias = alias;
}

Alias.prototype.from    = proxy('from');
Alias.prototype.to      = proxy('event');
Alias.prototype.channel = proxy('channel');

Alias.prototype.options = function () {
  return clone(this.alias.options || this.alias.context);
};


Alias.prototype.json = function () {
  return this.alias;
};


function proxy (name) {
  return function () { return clone(this.alias[name]); };
}