var Facade    = require('./facade')
  , component = require('require-component')(require)
  , clone     = component('clone')
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


Track.prototype.userId     = Facade.proxy('userId');
Track.prototype.sessionId  = Facade.proxy('sessionId');
Track.prototype.event      = Facade.proxy('event');
Track.prototype.properties = Facade.proxy('properties');

Track.prototype.referrer   = Facade.proxy('properties.referrer');
Track.prototype.username   = Facade.proxy('properties.username');

Track.prototype.query      = Facade.proxy('options.query');


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
};