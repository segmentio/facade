var component = require('require-component')(require)
  , clone     = component('clone')
  , morph     = component('morph')
  , uaParser  = component('ua-parser-js');


var aliases = [
  morph.snake,
  morph.snakeCaps,
  morph.dashed,
  morph.camel,
  morph.human,
  morph.title
];


module.exports = Facade;


function Facade (obj) {
  obj.timestamp = obj.timestamp || new Date();
  this.obj = obj;
}


Facade.proxy = function (name, field) {
  return function () {
    var obj = field ? this[field] : this.obj;
    if (!obj) return;
    if (typeof obj === 'function') obj = obj.apply(this, arguments) || {};

    for (var i = 0; i < aliases.length; i++) {
      var aliased = aliases[i](name);
      if (obj.hasOwnProperty(aliased)) return clone(obj[aliased]);
    }
  };
};


Facade.prototype.json = function () {
  return clone(this.obj);
};


Facade.prototype.options = function () {
  return clone(this.obj.options || this.obj.context) || {};
};


Facade.prototype.userAgent = function () {
  var ua = Facade.proxy('userAgent', 'options');
  if (!ua) return;

  return uaParser(ua);
};


Facade.prototype.channel   = Facade.proxy('channel');
Facade.prototype.timestamp = Facade.proxy('timestamp');
Facade.prototype.ip        = Facade.proxy('ip', 'options');