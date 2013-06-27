var Facade    = require('./facade')
  , component = require('require-component')(require)
  , inherit   = component('inherit');


module.exports = Alias;


function Alias(alias) {
  Facade.call(this, alias);
}


inherit(Alias, Facade);


Alias.prototype.action = function () {
  return 'alias';
};


Alias.prototype.from    = Facade.proxy('from');
Alias.prototype.to      = Facade.proxy('to');