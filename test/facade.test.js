'use strict';

var Facade = require('../lib');
var assert = require('proclaim');
var isodate = require('@segment/isodate');
var sinon = require('sinon');

describe('Facade', function() {
  var clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
  });

  describe('options', function() {
    describe('clone', function() {
      it('should store a copy of `obj` when clone=true', function() {
        var obj = { timestamp: '1979', nested: {} };
        var facade = new Facade(obj, { clone: true });
        assert.notStrictEqual(facade.obj, obj);
        assert.notStrictEqual(facade.obj.nested, obj.nested);
      });

      it('should not mutate the original object during instantiation when clone=true (GH#77)', function() {
        var now = new Date();
        var obj = { timestamp: '1979', birthday: '1999', now: now };
        var facade = new Facade(obj, { clone: true });
        assert.notStrictEqual(facade.obj, obj);
        assert.strictEqual(obj.timestamp, '1979');
        assert.strictEqual(obj.birthday, '1999');
        assert.strictEqual(obj.now, now);
      });

      it('should store a reference to `obj` when clone=false', function() {
        var obj = {};
        var facade = new Facade(obj, { clone: false });
        assert.strictEqual(facade.obj, obj);
      });
    });

    // TODO: Add tests for traverse
    xdescribe('traverse', function() {});
  });

  describe('.proxy()', function() {
    var facade;
    var obj;

    beforeEach(function() {
      obj = {
        name: 'Flight of the Conchords',
        members: {
          Brett: 'Likes animals',
          Jemaine: 'Rock and roll',
          Murray: 'Band manager'
        },
        band: { meeting: { present: true } },
        dates: {
          start: '2014-01-01',
          end: '2014-02-01'
        }
      };
      facade = new Facade(obj);
    });

    it('should proxy a single field', function() {
      facade.members = Facade.field('members');
      assert.deepEqual(facade.members(), obj.members);
      assert.deepEqual(facade.proxy('members'), facade.members());
    });

    it('should proxy a nested field', function() {
      facade.brett = Facade.proxy('members.Brett');
      assert.deepEqual(facade.brett(), obj.members.Brett);
      assert.deepEqual(facade.brett(), facade.proxy('members.Brett'));
    });

    it('should proxy a multiple-nested field', function() {
      facade.present = Facade.proxy('band.meeting.present');
      assert.deepEqual(facade.present(), obj.band.meeting.present);
      assert.deepEqual(facade.present(), facade.proxy('band.meeting.present'));
    });

    it('should proxy a method as the first field', function() {
      facade.virtual = function() { return { result: true }; };
      assert.deepEqual(facade.proxy('virtual.result'), true);
      facade.test = Facade.proxy('virtual.result');
      assert.deepEqual(facade.test(), true);
    });

    it('should convert dates', function() {
      var dates = facade.proxy('dates');
      assert.deepEqual(dates.start, isodate.parse('2014-01-01'));
      assert.deepEqual(dates.end, isodate.parse('2014-02-01'));
    });
  });

  describe('.multi()', function() {
    var msg;

    beforeEach(function() {
      msg = {
        nested: {
          website: 'https://segment.io',
          websites: ['https://segment.io']
        }
      };
    });

    it('should proxy websites', function() {
      msg = new Facade(msg);
      msg.all = Facade.multi('nested.website');
      assert.deepEqual(msg.all(), ['https://segment.io']);
    });

    it('should proxy [.website]', function() {
      delete msg.nested.websites;
      msg = new Facade(msg);
      msg.all = Facade.multi('nested.website');
      assert.deepEqual(msg.all(), ['https://segment.io']);
    });

    it('should return empty array if .website and .websites are missing', function() {
      msg = new Facade({});
      msg.all = Facade.multi('nested.website');
      assert.deepEqual(msg.all(), []);
    });
  });

  describe('.options(name)', function() {
    var msg;

    beforeEach(function() {
      msg = new Facade({
        context: {
          Salesforce: {
            object: 'Account'
          }
        },
        integrations: {
          Salesforce: true
        }
      });
    });

    it('should return the correct object', function() {
      assert.deepEqual(msg.options('Salesforce'), { object: 'Account' });
    });

    it('should always return an object', function() {
      delete msg.obj.context;
      assert.deepEqual(msg.options('Salesforce'), {});
    });

    it('should lookup options using obj-case', function() {
      assert.deepEqual(msg.options('salesforce'), { object: 'Account' });
    });

    it('should support deprecated context', function() {
      var msg = new Facade({
        context: {
          providers: {
            Salesforce: true
          },
          Salesforce: {
            object: 'Lead',
            lookup: { email: 'peter@initech.com' }
          }
        }
      });

      assert.deepEqual(msg.options('salesforce'), { object: 'Lead', lookup: { email: 'peter@initech.com' } });
    });
  });

  describe('.one()', function() {
    var msg;

    beforeEach(function() {
      msg = {
        nested: {
          website: 'https://segment.io',
          websites: ['https://segment.io']
        }
      };
    });

    it('should proxy .website', function() {
      msg = new Facade(msg);
      msg.one = Facade.one('nested.website');
      assert.deepEqual(msg.one(), 'https://segment.io');
    });

    it('should proxy .websites[0]', function() {
      delete msg.nested.website;
      msg = new Facade(msg);
      msg.one = Facade.one('nested.website');
      assert.deepEqual(msg.one(), 'https://segment.io');
    });

    it('should return null if .website and .websites are missing', function() {
      msg = new Facade({});
      msg.one = Facade.one('nested.website');
      assert.deepEqual(msg.one(), undefined);
    });
  });

  describe('.json()', function() {
    it('should return the full object', function() {
      var obj = { a: 'b', c: 'd', x: [1, 2, 3], timestamp: isodate.parse(1979) };
      var facade = new Facade(obj);
      assert.deepEqual(facade.json(), obj);
    });

    it('should add .type', function() {
      var track = new Facade.Track({});
      assert.deepEqual(track.json().type, 'track');
    });
  });

  describe('.context()', function() {
    it('should pull from "context" for backwards compatibility', function() {
      var options = { a: 'b' };
      var facade = new Facade({ options: options });
      assert.deepEqual(facade.context(), options);
      assert.deepEqual(facade.options(), options);
    });

    it('should pull from "context"', function() {
      var context = { a: 'b' };
      var facade = new Facade({ context: context });
      assert.deepEqual(facade.context(), context);
    });

    it('should not get context when all integrations are disabled', function() {
      var context = { all: false };
      var facade = new Facade({ context: context });
      assert.strictEqual(facade.context('Customer.io'), undefined);
    });

    it('should not get context for disabled by default integrations', function() {
      var facade = new Facade({});
      assert.strictEqual(facade.context('Salesforce'), undefined);
      assert.deepEqual(facade.context('Customer.io'), {});
    });

    it('should get context for a specifically enabled integration', function() {
      var context = { all: false, 'Customer.io': true };
      var facade = new Facade({ context: context });

      // sanity check.
      assert.deepEqual(facade.context('Customer.io'), {});
      assert.strictEqual(facade.context('HelpScout'), undefined);
      assert.strictEqual(facade.context('HubSpot'), undefined);

      // flat
      context = { all: false, 'Customer.io': { setting: true } };
      facade = new Facade({ context: context });
      assert.deepEqual(facade.context('Customer.io'), { setting: true });
      assert.strictEqual(facade.context('HelpScout'), undefined);

      // .integrations
      context = { HubSpot: { x: 1 } };
      facade = new Facade({ integrations: context });
      assert.deepEqual(facade.context('hub_spot'), { x: 1 });

      // context.providers
      context = { providers: { HubSpot: { x: 1 } } };
      facade = new Facade({ context: context });
      assert.deepEqual(facade.context('hub_spot'), { x: 1 });
    });

    it('should get context for a disabled by default integration that is enabled', function() {
      var context = { HubSpot: { setting: 'x' } };
      var facade = new Facade({ context: context });

      assert.deepEqual(facade.context('HubSpot'), { setting: 'x' });
      assert.deepEqual(facade.context('Customer.io'), {});
      assert.strictEqual(facade.context('Salesforce'), undefined);
    });

    it('should use obj-case', function() {
      var opts = { Intercom: { x: 'y' } };
      var facade = new Facade({ context: opts });
      assert.deepEqual(facade.context('intercom'), { x: 'y' });
      assert.deepEqual(facade.context('Intercom'), { x: 'y' });
    });
  });

  describe('.enabled()', function() {
    it('should be enabled by default', function() {
      var facade = new Facade({});
      assert.strictEqual(facade.enabled('Customer.io'), true);
    });

    it('should not be enabled if all == false', function() {
      var facade = new Facade({ context: { all: false } });
      assert.strictEqual(facade.enabled('Customer.io'), false);
    });

    it('should be able to override all == false', function() {
      var context = { all: false, 'Customer.io': { x: 1 } };
      var facade = new Facade({ context: context });
      assert.strictEqual(facade.enabled('Customer.io'), true);
    });

    it('should override all == true', function() {
      var context = { all: true, 'Customer.io': false };
      var facade = new Facade({ context: context });
      assert.strictEqual(facade.enabled('Customer.io'), false);
    });

    it('should use the providers.all', function() {
      var context = { providers: { all: false, 'Customer.io': true } };
      var facade = new Facade({ context: context });
      assert.strictEqual(facade.enabled('Customer.io'), true);
      assert.strictEqual(facade.enabled('Google Analytics'), false);
    });

    it('should only use disabled integrations when explicitly enabled', function() {
      var facade = new Facade({});
      assert.strictEqual(facade.enabled('Salesforce'), false);
      facade = new Facade({ context: { Salesforce: { x: 1 } } });
      assert.strictEqual(facade.enabled('Salesforce'), true);
    }).skip();

    it('should fall back to old providers api', function() {
      var providers = { 'Customer.io': false, Salesforce: true };
      var facade = new Facade({ context: { providers: providers } });
      assert.strictEqual(facade.enabled('Customer.io'), false);
      assert.strictEqual(facade.enabled('Salesforce'), true);
    });

    it('should pull from .integrations', function() {
      var integrations = { 'Customer.io': false, Salesforce: true };
      var facade = new Facade({ integrations: integrations });
      assert.strictEqual(facade.enabled('Customer.io'), false);
      assert.strictEqual(facade.enabled('Salesforce'), true);
    });

    it('should pull from .integrations.all', function() {
      var facade = new Facade({ integrations: { all: false } });
      assert.strictEqual(facade.enabled('Customer.io'), false);
    });
  });

  describe('.active()', function() {
    it('should be active by default', function() {
      var facade = new Facade({});
      assert.strictEqual(facade.active(), true);
    });

    it('should be active if enabled', function() {
      var facade = new Facade({ context: { active: true } });
      assert.strictEqual(facade.active(), true);
    });

    it('should not be active if disabled', function() {
      var facade = new Facade({ context: { active: false } });
      assert.strictEqual(facade.active(), false);
    });
  });

  describe('.groupId()', function() {
    it('should proxy the groupId', function() {
      var groupId = 'groupId';
      var facade = new Facade({ context: { groupId: groupId } });
      assert.deepEqual(facade.groupId(), groupId);
    });
  });

  describe('.traits()', function() {
    it('should proxy the traits', function() {
      var traits = { someVal: 1 };
      var facade = new Facade({ context: { traits: traits } });
      assert.deepEqual(facade.traits(), traits);
    });

    it('should return an empty object with no traits', function() {
      var facade = new Facade({});
      assert.deepEqual(facade.traits(), {});
    });

    it('should mixin id if available', function() {
      var id = 123;
      var facade = new Facade({ userId: id });
      assert.deepEqual(facade.traits(), { id: id });
    });

    it('should respect aliases', function() {
      var facade = new Facade({ context: { traits: { a: 'b', c: 'c', email: 'a@b.com' } } });
      assert.deepEqual(facade.traits({ a: 'b', email: '$email' }), { $email: 'a@b.com', b: 'b', c: 'c' });
    });
  });

  describe('.channel()', function() {
    it('should return the channel', function() {
      var channel = 'english';
      var facade = new Facade({ channel: channel });
      assert.deepEqual(facade.channel(), channel);
    });
  });

  describe('.timezone()', function() {
    it('should return the timezone', function() {
      var timezone = 'America/New_York';
      var facade = new Facade({ context: { timezone: timezone } });
      assert.deepEqual(facade.timezone(), timezone);
    });
  });

  describe('.timestamp()', function() {
    it('should return the current timestamp if none is supplied', function() {
      var facade = new Facade({});
      assert.notStrictEqual(facade.timestamp(), undefined);
    });

    it('should return the specified timestamp', function() {
      var timestamp = new Date();
      var facade = new Facade({ timestamp: timestamp });
      assert.deepEqual(facade.timestamp(), timestamp);
      clock.tick(10);
      assert.notEqual(new Date(), timestamp);
    });

    it('should cast timestamps to dates', function() {
      var facade = new Facade({ timestamp: '5/12/2015' });
      assert.deepEqual(facade.timestamp(), new Date('5/12/2015'));
    });

    it('should cast ms to date', function() {
      var d = new Date().getTime();
      var facade = new Facade({ timestamp: d });
      assert.deepEqual(facade.timestamp().getTime(), d);
    });
  });

  describe('.userAgent()', function() {
    it('should return the userAgent in context', function() {
      var facade = new Facade({ context: { userAgent: 'safari' } });
      assert.deepEqual(facade.userAgent(), 'safari');
    });

    it('should return the userAgent in context', function() {
      var facade = new Facade({ context: { userAgent: 'safari' } });
      assert.deepEqual(facade.userAgent(), 'safari');
    });
  });

  describe('.ip()', function() {
    it('should return the ip in context', function() {
      var ip = '4.8.15.16';
      var facade = new Facade({ context: { ip: ip } });
      assert.deepEqual(facade.ip(), ip);
    });

    it('should return the ip in context', function() {
      var ip = '4.8.15.16';
      var facade = new Facade({ context: { ip: ip } });
      assert.deepEqual(facade.ip(), ip);
    });
  });

  describe('.library()', function() {
    it('should return unknown if library is not present', function() {
      assert.deepEqual(new Facade({}).library(), { name: 'unknown', version: null });
    });

    it('should detect a library that is a string', function() {
      assert.deepEqual(
        new Facade({ options: { library: 'analytics-node' } }).library(),
        { name: 'analytics-node', version: null }
      );
    });

    it('should detect a library that is an object', function() {
      assert.deepEqual(
        new Facade({ options: { library: { name: 'analytics-node', version: 1.0 } } }).library(),
        { name: 'analytics-node', version: 1.0 }
      );
    });
  });

  describe('.device()', function() {
    it('should return the device', function() {
      var facade = new Facade({ context: { device: { token: 'token' } } });
      assert.deepEqual(facade.device(), { token: 'token' });
    });

    it('should leave existing device-types untouched', function() {
      var facade = new Facade({
        context: {
          library: { name: 'analytics-ios' },
          device: { type: 'browser' }
        }
      });
      assert.deepEqual(facade.device().type, 'browser');
    });

    it('should infer device.type when library.name is analytics-ios', function() {
      var ios = { name: 'analytics-ios' };
      var facade = new Facade({ context: { library: ios } });
      assert.deepEqual(facade.device().type, 'ios');
    });

    it('should infer device.type when library.name is analytics-android', function() {
      var android = { name: 'analytics-android' };
      var facade = new Facade({ context: { library: android } });
      assert.deepEqual(facade.device().type, 'android');
    });
  });

  describe('.city()', function() {
    it('should pull from traits.address.city', function() {
      var msg = new Facade({ context: {
        traits: { address: { city: 'city' } }
      } });
      assert.deepEqual(msg.city(), 'city');
    });

    it('should pull from traits.city', function() {
      var msg = new Facade({ context: { traits: { city: 'city' } } });
      assert.deepEqual(msg.city(), 'city');
    });
  });

  describe('.country()', function() {
    it('should pull from traits.address.country', function() {
      var msg = new Facade({ context: {
        traits: { address: { country: 'country' } }
      } });
      assert.deepEqual(msg.country(), 'country');
    });

    it('should pull from traits.country', function() {
      var msg = new Facade({ context: { traits: { country: 'country' } } });
      assert.deepEqual(msg.country(), 'country');
    });
  });

  describe('.state()', function() {
    it('should pull from traits.address.state', function() {
      var msg = new Facade({ context: {
        traits: { address: { state: 'state' } }
      } });
      assert.deepEqual(msg.state(), 'state');
    });

    it('should pull from traits.state', function() {
      var msg = new Facade({ context: { traits: { state: 'state' } } });
      assert.deepEqual(msg.state(), 'state');
    });
  });

  describe('.region()', function() {
    it('should pull from traits.address.region', function() {
      var msg = new Facade({ context: {
        traits: { address: { region: 'region' } }
      } });
      assert.deepEqual(msg.region(), 'region');
    });

    it('should pull from traits.region', function() {
      var msg = new Facade({ context: { traits: { region: 'region' } } });
      assert.deepEqual(msg.region(), 'region');
    });
  });

  describe('.street()', function() {
    it('should pull from traits.address.street', function() {
      var msg = new Facade({ context: {
        traits: { address: { street: 'street' } }
      } });
      assert.deepEqual(msg.street(), 'street');
    });

    it('should pull from traits.street', function() {
      var msg = new Facade({ context: { traits: { street: 'street' } } });
      assert.deepEqual(msg.street(), 'street');
    });
  });

  describe('.zip()', function() {
    it('should pull from traits.address.zip', function() {
      var msg = new Facade({ context: {
        traits: { address: { zip: 'zip' } }
      } });
      assert.deepEqual(msg.zip(), 'zip');
    });

    it('should pull from traits.zip', function() {
      var msg = new Facade({ context: { traits: { zip: 'zip' } } });
      assert.deepEqual(msg.zip(), 'zip');
    });

    it('should pull from traits.address.postalCode', function() {
      var msg = new Facade({ context: {
        traits: { address: { postalCode: 'postalCode' } }
      } });
      assert.deepEqual(msg.zip(), 'postalCode');
    });

    it('should pull from traits.postalCode', function() {
      var msg = new Facade({ context: { traits: { postalCode: 'postalCode' } } });
      assert.deepEqual(msg.zip(), 'postalCode');
    });
  });
});
