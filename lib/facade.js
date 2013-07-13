var component = require('require-component')(require)
  , clone     = component('clone')
  , isEnabled = component('./is-enabled')
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


/**
 * Returns the proxy for the name and field
 * @param {String} name   variable name to select for ('options' or 'userId')
 * @param {String} field  the field to start with ('traits', or 'properties')
 */

Facade.prototype.proxy = function (name, field) {
  var obj = field ? this[field] : this.obj;
  if (!obj) return;
  if (typeof obj === 'function') obj = obj.call(this) || {};

  for (var i = 0; i < aliases.length; i++) {
    var aliased = aliases[i](name);
    if (obj.hasOwnProperty(aliased)) return clone(obj[aliased]);
  }
};


/**
 * Utility method to always proxy a particular name and field
 * @param {String} name   variable name to select for ('options' or 'userId')
 * @param {String} field  the field to start with ('traits', or 'properties')
 */

Facade.proxy = function (name, field) {
  return function () {
    return this.proxy(name, field);
  };
};


/**
 * Returns the basic json object of this facade.
 */

Facade.prototype.json = function () {
  return clone(this.obj);
};


/**
 * Returns the options relating to the call (formerly context). If you pass
 * an integration name, it will return the options for that integration, or
 * undefined if the integration is not enabled.
 */

Facade.prototype.options = function (integration) {
  var options = clone(this.obj.options || this.obj.context) || {};
  if (!integration) return options;

  if (!this.enabled(integration)) return;

  return options[integration] || {};
};


/**
 * Checks whether an integration is enabled
 */

Facade.prototype.enabled = function (integration) {
  var allEnabled = this.proxy('all', 'options');
  if (typeof allEnabled !== 'boolean') allEnabled = true;

  var enabled = allEnabled && isEnabled(integration)
    , options = this.options();

  // If the integration is explicitly enabled or disabled, use that
  // First, check options.providers for backwards compatibility
  if (options.providers && options.providers.hasOwnProperty(integration)) {
    enabled = options.providers[integration];
  }

  // Next, check for the integration's existence in 'options' to enable it.
  // If the settings are a boolean, use that, otherwise it should be enabled.
  if (options.hasOwnProperty([integration])) {
    var settings = options[integration];
    if (typeof settings === 'boolean') enabled = settings;
    else enabled = true;
  }

  return enabled;
};


/**
 * Parses the useragent from the options.
 */

Facade.prototype.userAgent = function () {
  var ua = Facade.proxy('userAgent', 'options');
  if (!ua) return;

  return uaParser(ua);
};


Facade.prototype.channel   = Facade.proxy('channel');
Facade.prototype.timestamp = Facade.proxy('timestamp');
Facade.prototype.ip        = Facade.proxy('ip', 'options');