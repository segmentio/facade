'use strict';

var Screen = require('../lib').Screen;
var Track = require('../lib').Track;
var assert = require('proclaim');
var newDate = require('new-date');

describe('Screen', function() {
  var obj;
  var screen;

  beforeEach(function() {
    obj = {};
    obj.userId = 2;
    obj.sessionId = 3;
    obj.category = 'songs';
    obj.name = 'ab frank';
    screen = new Screen(obj);
  });

  describe('.type()', function() {
    it('should have the proper .type()', function() {
      assert.deepEqual(screen.type(), 'screen');
    });

    it('should equal .action()', function() {
      assert.deepEqual(screen.type(), screen.action());
    });
  });

  describe('.category()', function() {
    it('should proxy category', function() {
      assert.deepEqual(screen.category(), 'songs');
    });
  });

  describe('.userId()', function() {
    it('should proxy the userId', function() {
      assert.deepEqual(screen.userId(), obj.userId);
    });
  });

  describe('.sessionId()', function() {
    it('should proxy the sessionId', function() {
      assert.deepEqual(screen.sessionId(), obj.sessionId);
    });
  });

  describe('.properties()', function() {
    it('should proxy properties', function() {
      var obj = {};
      var p = new Screen({ properties: obj });
      assert.deepEqual(p.properties(), obj);
    });

    it('should default to an empty object if properties is undefined', function() {
      var screen = new Screen({});
      assert.deepEqual(screen.properties(), {});
    });

    it('should mixin category and name', function() {
      var screen = new Screen({
        properties: { prop: true },
        category: 'category',
        name: 'name'
      });

      assert.deepEqual(
        screen.properties(),
        { category: 'category', name: 'name', prop: true }
      );
    });
  });

  describe('.email()', function() {
    var email = 'han@segment.com';

    it('should proxy the email from properties', function() {
      var screen = new Screen({ userId: 'x', properties: { email: email } });
      assert.deepEqual(screen.email(), email);
    });

    it('should proxy the email from userId', function() {
      var screen = new Screen({ userId: email });
      assert.deepEqual(screen.email(), email);
    });

    it('should proxy the email from context.traits', function() {
      var screen = new Screen({ context: { traits: { email: email } } });
      assert.deepEqual(screen.email(), email);
    });

    it('should not error if there is no email', function() {
      var screen = new Screen({});
      assert.deepEqual(screen.email(), undefined);
    });
  });

  describe('.name()', function() {
    it('should proxy name', function() {
      assert.deepEqual(screen.name(), obj.name);
    });
  });

  describe('.referrer()', function() {
    it('should proxy properties.referrer', function() {
      var screen = new Screen({ properties: { referrer: 'url' } });
      assert.deepEqual(screen.referrer(), 'url');
    });

    it('should proxy context.referrer.url', function() {
      var screen = new Screen({ context: { referrer: { url: 'url' } } });
      assert.deepEqual(screen.referrer(), 'url');
    });
  });

  describe('.event()', function() {
    it('should concat name if given', function() {
      var screen = new Screen({});
      assert.deepEqual(screen.event('baz'), 'Viewed baz Screen');
    });

    it('should return "Loaded a Screen" if name is omitted', function() {
      assert.deepEqual(new Screen({}).event(), 'Loaded a Screen');
    });

    it('should return just the name if padScreenName is false', function() {
      var screen = new Screen({});
      assert.deepEqual(screen.event('Foo', false), 'Foo');
    });
  });

  describe('.track()', function() {
    it('should convert the screen to track with event', function() {
      var screen = new Screen({
        anonymousId: 'anon-id',
        userId: 'user-id',
        context: { ip: '0.0.0.0' },
        timestamp: newDate('2014-01-01'),
        properties: { prop: true },
        category: 'category',
        name: 'name'
      });

      assert.strictEqual(screen.track('event').anonymousId(), 'anon-id');
      assert.strictEqual(screen.track('event').userId(), 'user-id');
      assert(screen.track('event') instanceof Track);
      assert.deepEqual(screen.track().event(), 'Loaded a Screen');
      assert.deepEqual(screen.track('name').event(), 'Viewed name Screen');
      assert.deepEqual(screen.track('category').event(), 'Viewed category Screen');
      assert.deepEqual(screen.track('category').timestamp(), screen.timestamp());
      assert.deepEqual(screen.track('category').context(), screen.context());
      assert.deepEqual(
        screen.track('event').properties(),
        { category: 'category', name: 'name', prop: true }
      );
    });
  });

  describe('.fullName()', function() {
    it('should return only name if category is omitted', function() {
      var screen = new Screen({
        name: 'baz'
      });

      assert.deepEqual(screen.fullName(), 'baz');
    });

    it('should return the category + name if available', function() {
      var screen = new Screen({
        category: 'cat',
        name: 'baz'
      });

      assert.deepEqual(screen.fullName(), 'cat baz');
    });
  });
});
