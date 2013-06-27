var Facade    = require('./facade')
  , component = require('require-component')(require)
  , clone     = component('clone')
  , inherit   = component('inherit');


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

Track.prototype.referrer   = Facade.proxy('referrer', 'properties');
Track.prototype.username   = Facade.proxy('username', 'properties');

Track.prototype.query      = Facade.proxy('query',    'options');


/**
 * Parse the revenue from a number or a string matching '$45.00'
 */

Track.prototype.revenue = function () {
  var proxy   = Facade.proxy('revenue', 'properties')
    , revenue = proxy.call(this);

  if (!revenue) return;
  if (typeof revenue === 'number') return revenue;
  if (typeof revenue !== 'string') return;

  revenue = revenue.replace(/\$/g, '');
  revenue = parseFloat(revenue);

  if (!isNaN(revenue)) return revenue;
};

