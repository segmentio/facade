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
      query : 'segmentio'
    }
  };

  var track = new Track(args);


  it('should have the proper .action()', function () {
    expect(track.action()).to.eql('track');
  });

  it('should proxy the userId', function () {
    expect(track.userId()).to.eql(args.userId);
  });

  it('should proxy the sessionId', function () {
    expect(track.sessionId()).to.eql(args.sessionId);
  });

  it('should proxy the event', function () {
    expect(track.event()).to.eql(args.event);
  });

  it('should proxy the properties', function () {
    expect(track.properties()).to.eql(args.properties);
  });

  it('should proxy the referrer', function () {
    expect(track.referrer()).to.eql(args.properties.referrer);
  });

  it('should proxy the username', function () {
    expect(track.username()).to.eql(args.properties.username);
  });

  it('should proxy the query', function () {
    expect(track.query()).to.eql(args.options.query);
  });

  it('should proxy the revenue', function () {
    expect(track.revenue()).to.eql(50);
  });

  it('should proxy the email', function () {
    expect(track.email()).to.eql(args.userId);
  });
});