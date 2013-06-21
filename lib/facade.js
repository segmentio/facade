var clone = require('clone');


module.exports = Facade;


function Facade (obj) {
  this.obj = obj;
}


Facade.proxy = function (name) {
  return function () {
    return clone(this.obj[name]);
  };
};


Facade.prototype.json = function () {
  return clone(this.obj);
};


Facade.prototype.options = function () {
  return clone(this.obj.options || this.obj.context);
};


Facade.prototype.channel   = Facade.proxy('channel');
Facade.prototype.timestamp = Facade.proxy('timestamp');