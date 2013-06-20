var clone = require('clone');


module.exports = Track;


function Track(track) {
  this.track = track;
}

Track.prototype.userId     = proxy('userId');
Track.prototype.event      = proxy('event');
Track.prototype.properties = proxy('properties');
Track.prototype.channel    = proxy('channel');

Track.prototype.action = function () {
  return 'track';
};


Track.prototype.options = function () {
  return clone(this.track.options || this.track.context);
};


Track.prototype.json = function () {
  return this.track;
};


function proxy (name) {
  return function () { return clone(this.track[name]); };
}