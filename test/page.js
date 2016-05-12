'use strict';

var Page = require('../lib').Page;
var Track = require('../lib').Track;
var assert = require('proclaim');

describe('Page', function() {
  var obj;
  var page;

  beforeEach(function() {
    obj = {};
    obj.userId = 2;
    obj.sessionId = 3;
    obj.category = 'docs';
    obj.name = 'docs';
    page = new Page(obj);
  });

  describe('.type()', function() {
    it('should have the proper .type()', function() {
      assert.deepEqual(page.type(), 'page');
    });

    it('should equal .action()', function() {
      assert.deepEqual(page.type(), page.action());
    });
  });

  describe('.category()', function() {
    it('should proxy category', function() {
      assert.deepEqual(page.category(), 'docs');
    });
  });

  describe('.userId()', function() {
    it('should proxy the userId', function() {
      assert.deepEqual(page.userId(), obj.userId);
    });
  });

  describe('.sessionId()', function() {
    it('should proxy the sessionId', function() {
      assert.deepEqual(page.sessionId(), obj.sessionId);
    });
  });

  describe('.properties()', function() {
    it('should proxy properties', function() {
      var obj = {};
      var p = new Page({ properties: obj });
      assert.deepEqual(p.properties(), obj);
    });

    it('should default to an empty object if properties is undefined', function() {
      var page = new Page({});
      assert.deepEqual(page.properties(), {});
    });

    it('should mixin category and name', function() {
      var page = new Page({
        properties: { prop: true },
        category: 'category',
        name: 'name'
      });

      assert.deepEqual(
        page.properties(),
        { category: 'category', name: 'name', prop: true }
      );
    });

    it('should respect aliases', function(){
      var page = new Page({
        properties: { prop: true },
        category: 'category',
        name: 'name'
      });

      assert.deepEqual(
        page.properties({ name: 'pagename', prop: 'alias' }),
        { category: 'category', pagename: 'name', alias: true }
      );
    });
  });

  describe('.email()', function() {
    var email = 'han@segment.com';

    it('should proxy the email from properties', function() {
      var page = new Page({ userId: 'x', properties: { email: email } });
      assert.deepEqual(page.email(), email);
    });

    it('should proxy the email from userId', function() {
      var page = new Page({ userId: email });
      assert.deepEqual(page.email(), email);
    });

    it('should proxy the email from context.traits', function() {
      var page = new Page({ context: { traits: { email: email }}});
      assert.deepEqual(page.email(), email);
    });

    it('should not error if there is no email', function() {
      var page = new Page({});
      assert.deepEqual(page.email(), undefined);
    });
  });

  describe('.name()', function() {
    it('should proxy name', function() {
      assert.deepEqual(page.name(), obj.name);
    });
  });

  describe('.event()', function() {
    it('should concat name if given', function() {
      var page = new Page({});
      assert.deepEqual(page.event('baz'), 'Viewed baz Page');
    });

    it('should return "Loaded a Page" if name is omitted', function() {
      assert.deepEqual(new Page({}).event(), 'Loaded a Page');
    });
  });

  describe('.referrer()', function() {
    it('should proxy properties.referrer', function() {
      var page = new Page({ properties: { referrer: 'url' } });
      assert.deepEqual(page.referrer(), 'url');
    });

    it('should proxy context.referrer.url', function() {
      var page = new Page({ context: { referrer: { url: 'url' } } });
      assert.deepEqual(page.referrer(), 'url');
    });

    it('should proxy context.page.referrer', function() {
      var page = new Page({ context: { page: { referrer: 'url' } } });
      assert.deepEqual(page.referrer(), 'url');
    });
  });

  describe('.track()', function() {
    it('should convert the page to track with event', function() {
      var page = new Page({
        anonymousId: 'anon-id',
        userId: 'user-id',
        timestamp: new Date('2014-01-01'),
        context: { ip: '0.0.0.0' },
        properties: { prop: true },
        category: 'category',
        name: 'name'
      });

      assert.deepEqual(page.track('event').anonymousId(), 'anon-id');
      assert.deepEqual(page.track('event').userId(), 'user-id');
      assert(page.track('event') instanceof Track);
      assert.deepEqual(page.track().event(), 'Loaded a Page');
      assert.deepEqual(page.track('name').event(), 'Viewed name Page');
      assert.deepEqual(page.track('category').event(), 'Viewed category Page');
      assert.deepEqual(page.track('category').event(), 'Viewed category Page');
      assert.deepEqual(page.track('category').timestamp(), page.timestamp());
      assert.deepEqual(page.track('category').context(), page.context());
      assert.deepEqual(
        page.track('event').properties(),
        { category: 'category', name: 'name', prop: true }
      );
    });
  });

  describe('.fullName()', function() {
    it('should return only name if category is omitted', function() {
      var page = new Page({
        name: 'baz'
      });

      assert.deepEqual(page.fullName(), 'baz');
    });

    it('should return the category + name if available', function() {
      var page = new Page({
        category: 'cat',
        name: 'baz'
      });

      assert.deepEqual(page.fullName(), 'cat baz');
    });
  });

  describe('.url()', function() {
    it('should proxy the url', function() {
      var msg = new Page({ properties: { url: 'url' } });
      assert.deepEqual(msg.url(), 'url');
    });
  });

  describe('.title()', function() {
    it('should proxy the url', function() {
      var msg = new Page({ properties: { title: 'title' } });
      assert.deepEqual(msg.title(), 'title');
    });
  });

  describe('.path()', function() {
    it('should proxy the url', function() {
      var msg = new Page({ properties: { path: 'path' } });
      assert.deepEqual(msg.path(), 'path');
    });
  });
});
