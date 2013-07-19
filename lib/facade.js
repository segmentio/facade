var component = require('require-component')(require)
  , clone     = component('clone')
  , isEnabled = component('./is-enabled')
  , morph     = component('morph')
  , uaParser  = component('ua-parser-js');


module.exports = Facade;


function Facade (obj) {
  obj.timestamp = obj.timestamp || new Date();
  this.obj = obj;
}


/**
 * Returns the proxy for the field, will attempt to first use functions, then
 * fields which are part of the object.
 * @param {String} field  '.' separated name to select for ('options.Librato')
 */

Facade.prototype.proxy = function (field) {
  var fields = field.split('.');

  field  = fields.shift();

  // Call a function at the beginning to take advantage of facaded fields
  var obj = this[field] || this.field(field);
  if (!obj) return obj;
  if (typeof obj === 'function') obj = obj.call(this) || {};

  while (fields.length > 0) {
    field = fields.shift();
    obj = findAliased(obj, field);
    if (!obj) return obj;
  }

  return obj;
};


/**
 * Grab a specific field from the object. Differs from proxy in that it wont
 * do any funny 'virtual' business, just grabs the field
 */

Facade.prototype.field = function (field) {
  return this.obj[field];
};


/**
 * Utility method to always proxy a particular name and field
 * @param {String} name   variable name to select for ('options' or 'userId')
 * @param {String} field  the field to start with ('traits', or 'properties')
 */

Facade.proxy = function (field) {
  return function () {
    return this.proxy(field);
  };
};


/**
 * Utility method to grab a single field
 */

Facade.field = function (field) {
  return function () {
    return this.field(field);
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

  options = options[integration] || {};
  return typeof options === 'boolean' ? {} : options;
};


/**
 * Checks whether an integration is enabled
 */

Facade.prototype.enabled = function (integration) {
  var allEnabled = this.proxy('options.all');
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
  var ua = Facade.proxy('options.userAgent');
  if (!ua) return;

  return uaParser(ua);
};


/**
 * Basic Proxies
 */

Facade.prototype.channel   = Facade.field('channel');
Facade.prototype.timestamp = Facade.field('timestamp');
Facade.prototype.ip        = Facade.proxy('options.ip');


var aliases = [
  morph.snake,
  morph.snakeCaps,
  morph.dashed,
  morph.camel,
  morph.human,
  morph.title
];


/**
 * Finds the aliased field within the object.
 */

function findAliased (obj, field) {
  for (var i = 0; i < aliases.length; i++) {
    var aliased = aliases[i](field);
    if (obj.hasOwnProperty(aliased)) return clone(obj[aliased]);
  }
}