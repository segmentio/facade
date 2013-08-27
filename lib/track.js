var Facade    = require('./facade')
  , component = require('require-component')(require)
  , clone     = component('clone')
  , Identify  = component('./identify')
  , inherit   = component('inherit')
  , isEmail   = component('is-email');


module.exports = Track;


function Track(track) {
  Facade.call(this, track);
}


inherit(Track, Facade);


Track.prototype.action = function () {
  return 'track';
};


/**
 * Property fields
 */

Track.prototype.userId     = Facade.field('userId');
Track.prototype.sessionId  = Facade.field('sessionId');
Track.prototype.event      = Facade.field('event');


/**
 * Return properties or an empty object
 */

Track.prototype.properties = function () {
  return this.field('properties') || {};
};

/**
 * Backwards compat, should probably re-examine where these come from.
 */

Track.prototype.referrer   = Facade.proxy('properties.referrer');
Track.prototype.query      = Facade.proxy('options.query');


/**
 * Carrying through the user name
 */

Track.prototype.username = function () {
  return this.proxy('properties.username') || this.userId() || this.sessionId();
};


/**
 * Parse the revenue from a number or a string matching '$45.00'
 */

Track.prototype.revenue = function () {
  var proxy   = Facade.proxy('properties.revenue')
    , revenue = proxy.call(this);

  if (!revenue) return;
  if (typeof revenue === 'number') return revenue;
  if (typeof revenue !== 'string') return;

  revenue = revenue.replace(/\$/g, '');
  revenue = parseFloat(revenue);

  if (!isNaN(revenue)) return revenue;
};


/**
 * Use the email if the userId matches it
 */

Track.prototype.email = function () {
  var userId = this.userId() || this.sessionId();
  if (isEmail(userId)) return userId;

  return this.proxy('traits.email') || this.proxy('properties.email');
};


/**
 * Adds the ability to send 'super properties' as part of a track
 * TODO: remove me eventually and just use state on the server
 */

Track.prototype.traits = function () {
  return this.proxy('options.traits') || {};
};


/**
 * A utility to turn the pieces of a track call into an identify. Used for
 * integrations with super properties or rate limits.
 * TODO: remove me.
 */

Track.prototype.identify = function () {
  var json = this.json();
  json.traits = this.traits();
  return new Identify(json);
};