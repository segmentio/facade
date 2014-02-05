
var component = require('require-component')(require);
var clone = component('clone');
var Facade = component('./facade');
var Identify = component('./identify');
var inherit = component('inherit');
var isEmail = component('is-email');
var traverse = component('isodate-traverse');

/**
 * Expose `Track` facade.
 */

module.exports = Track;

/**
 * Initialize a new `Track` facade with a `dictionary` of arguments.
 *
 * @param {object} dictionary
 *   @property {String} event
 *   @property {String} userId
 *   @property {String} sessionId
 *   @property {Object} properties
 *   @property {Object} options
 */

function Track (dictionary) {
  Facade.call(this, dictionary);
}

/**
 * Inherit from `Facade`.
 */

inherit(Track, Facade);

/**
 * Return the facade's action.
 *
 * @return {String}
 */

Track.prototype.action = function () {
  return 'track';
};

/**
 * Setup some basic proxies.
 */

Track.prototype.userId = Facade.field('userId');
Track.prototype.sessionId = Facade.field('sessionId');
Track.prototype.event = Facade.field('event');
Track.prototype.value = Facade.proxy('properties.value');

/**
 * Misc
 */

Track.prototype.category = Facade.proxy('properties.category');
Track.prototype.state = Facade.proxy('properties.state');
Track.prototype.city = Facade.proxy('properties.city');
Track.prototype.zip = Facade.proxy('properties.zip');

/**
 * Ecommerce
 */

Track.prototype.id = Facade.proxy('properties.id');
Track.prototype.sku = Facade.proxy('properties.sku');
Track.prototype.tax = Facade.proxy('properties.tax');
Track.prototype.name = Facade.proxy('properties.name');
Track.prototype.price = Facade.proxy('properties.price');
Track.prototype.total = Facade.proxy('properties.total');
Track.prototype.coupon = Facade.proxy('properties.coupon');
Track.prototype.shipping = Facade.proxy('properties.shipping');
Track.prototype.transactionId = Facade.proxy('properties.transactionId');

/**
 * Get subtotal.
 *
 * @return {Number}
 */

Track.prototype.subtotal = function(){
  var subtotal = this.obj.properties.subtotal;
  var total = this.total();
  var n;

  if (subtotal) return subtotal;
  if (!total) return 0;
  if (n = this.tax()) total -= n;
  if (n = this.shipping()) total -= n;

  return total;
};

/**
 * Get products.
 *
 * @return {Array}
 */

Track.prototype.products = function(){
  var props = this.obj.properties || {};
  return props.products || [];
};

/**
 * Get quantity.
 *
 * @return {Number}
 */

Track.prototype.quantity = function(){
  var props = this.obj.properties || {};
  return props.quantity || 1;
};

/**
 * Get currency.
 *
 * @return {String}
 */

Track.prototype.currency = function(){
  var props = this.obj.properties || {};
  return props.currency || 'USD';
};

/**
 * BACKWARDS COMPATIBILITY: should probably re-examine where these come from.
 */

Track.prototype.referrer = Facade.proxy('properties.referrer');
Track.prototype.query = Facade.proxy('options.query');

/**
 * Get the call's properties.
 *
 * @param {Object} aliases
 * @return {Object}
 */

Track.prototype.properties = function (aliases) {
  var ret = this.field('properties') || {};
  aliases = aliases || {};

  for (var alias in aliases) {
    var value = null == this[alias]
      ? this.proxy('properties.' + alias)
      : this[alias]();
    if (null == value) continue;
    ret[aliases[alias]] = value;
    delete ret[alias];
  }

  return clone(traverse(ret));
};

/**
 * Get the call's "super properties" which are just traits that have been
 * passed in as if from an identify call.
 *
 * @return {Object}
 */

Track.prototype.traits = function () {
  return this.proxy('options.traits') || {};
};

/**
 * Get the call's username.
 *
 * @return {String or Undefined}
 */

Track.prototype.username = function () {
  return this.proxy('traits.username') ||
         this.proxy('properties.username') ||
         this.userId() ||
         this.sessionId();
};

/**
 * Get the call's email, using an the user ID if it's a valid email.
 *
 * @return {String or Undefined}
 */

Track.prototype.email = function () {
  var email = this.proxy('traits.email');
  if (email) return email;

  var userId = this.userId();
  if (isEmail(userId)) return userId;
};

/**
 * Get the call's revenue, parsing it from a string with an optional leading
 * dollar sign.
 *
 * @return {String or Undefined}
 */

Track.prototype.revenue = function () {
  var revenue = this.proxy('properties.revenue');

  if (!revenue) return;
  if (typeof revenue === 'number') return revenue;
  if (typeof revenue !== 'string') return;

  revenue = revenue.replace(/\$/g, '');
  revenue = parseFloat(revenue);

  if (!isNaN(revenue)) return revenue;
};

/**
 * Get cents.
 *
 * @return {Number}
 */

Track.prototype.cents = function(){
  var revenue = this.revenue();
  return 'number' != typeof revenue
    ? this.value() || 0
    : revenue * 100;
};

/**
 * A utility to turn the pieces of a track call into an identify. Used for
 * integrations with super properties or rate limits.
 *
 * TODO: remove me.
 *
 * @return {Facade}
 */

Track.prototype.identify = function () {
  var json = this.json();
  json.traits = this.traits();
  return new Identify(json);
};
