var Track  = require('..').Track
  , expect = require('expect.js');


describe('Track', function () {

  var args = {
    userId     : 'calvin@segment.io',
    sessionId  : 'abc123',
    properties : {
      revenue  : '$50',
      referrer : 'http://segment.io',
      username : 'calvinfo'
    },
    options : {
      query  : 'segmentio',
      traits : {
        x : 'y'
      }
    }
  };

  var track = new Track(args);

  describe('.action()', function () {
    it('should have the right action', function () {
      expect(track.action()).to.eql('track');
    });
  });

  describe('.userId()', function () {
    it('should proxy the userId', function () {
      expect(track.userId()).to.eql(args.userId);
    });
  });

  describe('.sessionId()', function () {
    it('should proxy the sessionId', function () {
      expect(track.sessionId()).to.eql(args.sessionId);
    });
  });

  describe('.event()', function () {
    it('should proxy the event', function () {
      expect(track.event()).to.eql(args.event);
    });
  });

  describe('.properties()', function () {
    it('should proxy the properties', function () {
      expect(track.properties()).to.eql(args.properties);
    });
  });

  describe('.referrer()', function () {
    it('should proxy the referrer', function () {
      expect(track.referrer()).to.eql(args.properties.referrer);
    });
  });

  describe('.username()', function () {
    it('should proxy the username', function () {
      expect(track.username()).to.eql(args.properties.username);
    });
  });

  describe('.query()', function () {
    it('should proxy the query', function () {
      expect(track.query()).to.eql(args.options.query);
    });
  });

  describe('.revenue()', function () {
    it('should proxy the revenue', function () {
      expect(track.revenue()).to.eql(50);
    });
  });

  describe('.email()', function () {
    it('should proxy the email', function () {
      expect(track.email()).to.eql(args.userId);
    });
  });

  describe('.traits()', function () {
    it('should proxy the traits', function () {
      expect(track.traits()).to.eql(args.options.traits);
    });

    it('should return an empty object with no traits', function () {
      var track = new Track({});
      expect(track.traits()).to.eql({});
    });
  });
});