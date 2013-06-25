var clone   = require('clone')
  , Facade  = require('./facade')
  , inherit = require('inherit');


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
Track.prototype.revenue    = Facade.proxy('revenue',  'properties');

Track.prototype.query      = Facade.proxy('query',    'options');