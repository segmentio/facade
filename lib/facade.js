var clone = require('clone')
  , morph = require('morph');


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
  this.obj = obj;
}


Facade.proxy = function (name, field) {
  return function () {
    var obj = field ? this[field] : this.obj;
    if (!obj) return;
    if (typeof obj === 'function') obj = obj() || {};

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


Facade.prototype.ip        = Facade.proxy('ip', 'options');
Facade.prototype.channel   = Facade.proxy('channel');
Facade.prototype.timestamp = Facade.proxy('timestamp');