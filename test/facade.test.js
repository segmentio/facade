"use strict";

import { Facade, Track } from "../lib";
import { notStrictEqual, strictEqual, deepEqual, notEqual } from "proclaim";
import { parse } from "@segment/isodate";
import { useFakeTimers } from "sinon";

let { field, proxy, multi, one } = Facade;

describe("Facade", function () {
  var clock;

  beforeEach(function () {
    clock = useFakeTimers();
  });

  afterEach(function () {
    clock.restore();
  });

  describe("options", function () {
    describe("clone", function () {
      it("should store a copy of `obj` when clone=true", function () {
        var obj = { timestamp: "1979", nested: {} };
        var facade = new Facade(obj, { clone: true });
        notStrictEqual(facade.obj, obj);
        notStrictEqual(facade.obj.nested, obj.nested);
      });

      it("should not mutate the original object during instantiation when clone=true (GH#77)", function () {
        var now = new Date();
        var obj = { timestamp: "1979", birthday: "1999", now: now };
        var facade = new Facade(obj, { clone: true });
        notStrictEqual(facade.obj, obj);
        strictEqual(obj.timestamp, "1979");
        strictEqual(obj.birthday, "1999");
        strictEqual(obj.now, now);
      });

      it("should store a reference to `obj` when clone=false", function () {
        var obj = {};
        var facade = new Facade(obj, { clone: false });
        strictEqual(facade.obj, obj);
      });
    });

    // TODO: Add tests for traverse
    xdescribe("traverse", function () {});
  });

  describe(".proxy()", function () {
    var facade;
    var obj;

    beforeEach(function () {
      obj = {
        name: "Flight of the Conchords",
        members: {
          Brett: "Likes animals",
          Jemaine: "Rock and roll",
          Murray: "Band manager",
        },
        band: { meeting: { present: true } },
        dates: {
          start: "2014-01-01",
          end: "2014-02-01",
        },
      };
      facade = new Facade(obj);
    });

    it("should proxy a single field", function () {
      facade.members = field("members");
      deepEqual(facade.members(), obj.members);
      deepEqual(facade.proxy("members"), facade.members());
    });

    it("should proxy a nested field", function () {
      facade.brett = proxy("members.Brett");
      deepEqual(facade.brett(), obj.members.Brett);
      deepEqual(facade.brett(), facade.proxy("members.Brett"));
    });

    it("should proxy a multiple-nested field", function () {
      facade.present = proxy("band.meeting.present");
      deepEqual(facade.present(), obj.band.meeting.present);
      deepEqual(facade.present(), facade.proxy("band.meeting.present"));
    });

    it("should proxy a method as the first field", function () {
      facade.virtual = function () {
        return { result: true };
      };
      deepEqual(facade.proxy("virtual.result"), true);
      facade.test = proxy("virtual.result");
      deepEqual(facade.test(), true);
    });

    it("should convert dates", function () {
      var dates = facade.proxy("dates");
      deepEqual(dates.start, parse("2014-01-01"));
      deepEqual(dates.end, parse("2014-02-01"));
    });
  });

  describe(".multi()", function () {
    var msg;

    beforeEach(function () {
      msg = {
        nested: {
          website: "https://segment.io",
          websites: ["https://segment.io"],
        },
      };
    });

    it("should proxy websites", function () {
      msg = new Facade(msg);
      msg.all = multi("nested.website");
      deepEqual(msg.all(), ["https://segment.io"]);
    });

    it("should proxy [.website]", function () {
      delete msg.nested.websites;
      msg = new Facade(msg);
      msg.all = multi("nested.website");
      deepEqual(msg.all(), ["https://segment.io"]);
    });

    it("should return empty array if .website and .websites are missing", function () {
      msg = new Facade({});
      msg.all = multi("nested.website");
      deepEqual(msg.all(), []);
    });
  });

  describe(".options(name)", function () {
    var msg;

    beforeEach(function () {
      msg = new Facade({
        context: {
          Salesforce: {
            object: "Account",
          },
        },
        integrations: {
          Salesforce: true,
        },
      });
    });

    it("should return the correct object", function () {
      deepEqual(msg.options("Salesforce"), { object: "Account" });
    });

    it("should always return an object", function () {
      delete msg.obj.context;
      deepEqual(msg.options("Salesforce"), {});
    });

    it("should lookup options using obj-case", function () {
      deepEqual(msg.options("salesforce"), { object: "Account" });
    });

    it("should support deprecated context", function () {
      var msg = new Facade({
        context: {
          providers: {
            Salesforce: true,
          },
          Salesforce: {
            object: "Lead",
            lookup: { email: "peter@initech.com" },
          },
        },
      });

      deepEqual(msg.options("salesforce"), {
        object: "Lead",
        lookup: { email: "peter@initech.com" },
      });
    });
  });

  describe(".one()", function () {
    var msg;

    beforeEach(function () {
      msg = {
        nested: {
          website: "https://segment.io",
          websites: ["https://segment.io"],
        },
      };
    });

    it("should proxy .website", function () {
      msg = new Facade(msg);
      msg.one = one("nested.website");
      deepEqual(msg.one(), "https://segment.io");
    });

    it("should proxy .websites[0]", function () {
      delete msg.nested.website;
      msg = new Facade(msg);
      msg.one = one("nested.website");
      deepEqual(msg.one(), "https://segment.io");
    });

    it("should return null if .website and .websites are missing", function () {
      msg = new Facade({});
      msg.one = one("nested.website");
      deepEqual(msg.one(), undefined);
    });
  });

  describe(".json()", function () {
    it("should return the full object", function () {
      var obj = { a: "b", c: "d", x: [1, 2, 3], timestamp: parse(1979) };
      var facade = new Facade(obj);
      deepEqual(facade.json(), obj);
    });

    it("should add .type", function () {
      var track = new Track({});
      deepEqual(track.json().type, "track");
    });
  });

  describe(".rawEvent()", function () {
    it("should return the input object unmodified", function () {
      var obj = {
        a: "b", c: "d", x: [1, 2, 3], 
        properties: {  iso_date_string: new Date().toISOString() }
      };
      var facade = new Facade(obj);
      deepEqual(facade.rawEvent(), obj);
    });

    it("should not add .type", function () {
      var track = new Track({});
      deepEqual(track.rawEvent().type, undefined);
    });

    it("should not add .timestamp", function () {
      var track = new Track({});
      deepEqual(track.rawEvent().timestamp, undefined);
    });
  });

  describe(".context()", function () {
    it('should pull from "context" for backwards compatibility', function () {
      var options = { a: "b" };
      var facade = new Facade({ options: options });
      deepEqual(facade.context(), options);
      deepEqual(facade.options(), options);
    });

    it('should pull from "context"', function () {
      var context = { a: "b" };
      var facade = new Facade({ context: context });
      deepEqual(facade.context(), context);
    });

    it("should not get context when all integrations are disabled", function () {
      var context = { all: false };
      var facade = new Facade({ context: context });
      strictEqual(facade.context("Customer.io"), undefined);
    });

    it("should not get context for disabled by default integrations", function () {
      var facade = new Facade({});
      strictEqual(facade.context("Salesforce"), undefined);
      deepEqual(facade.context("Customer.io"), {});
    });

    it("should get context for a specifically enabled integration", function () {
      var context = { all: false, "Customer.io": true };
      var facade = new Facade({ context: context });

      // sanity check.
      deepEqual(facade.context("Customer.io"), {});
      strictEqual(facade.context("HelpScout"), undefined);
      strictEqual(facade.context("HubSpot"), undefined);

      // flat
      context = { all: false, "Customer.io": { setting: true } };
      facade = new Facade({ context: context });
      deepEqual(facade.context("Customer.io"), { setting: true });
      strictEqual(facade.context("HelpScout"), undefined);

      // .integrations
      context = { HubSpot: { x: 1 } };
      facade = new Facade({ integrations: context });
      deepEqual(facade.context("hub_spot"), { x: 1 });

      // context.providers
      context = { providers: { HubSpot: { x: 1 } } };
      facade = new Facade({ context: context });
      deepEqual(facade.context("hub_spot"), { x: 1 });
    });

    it("should get context for a disabled by default integration that is enabled", function () {
      var context = { HubSpot: { setting: "x" } };
      var facade = new Facade({ context: context });

      deepEqual(facade.context("HubSpot"), { setting: "x" });
      deepEqual(facade.context("Customer.io"), {});
      strictEqual(facade.context("Salesforce"), undefined);
    });

    it("should use obj-case", function () {
      var opts = { Intercom: { x: "y" } };
      var facade = new Facade({ context: opts });
      deepEqual(facade.context("intercom"), { x: "y" });
      deepEqual(facade.context("Intercom"), { x: "y" });
    });
  });

  describe(".enabled()", function () {
    it("should be enabled by default", function () {
      var facade = new Facade({});
      strictEqual(facade.enabled("Customer.io"), true);
    });

    it("should not be enabled if all == false", function () {
      var facade = new Facade({ context: { all: false } });
      strictEqual(facade.enabled("Customer.io"), false);
    });

    it("should be able to override all == false", function () {
      var context = { all: false, "Customer.io": { x: 1 } };
      var facade = new Facade({ context: context });
      strictEqual(facade.enabled("Customer.io"), true);
    });

    it("should override all == true", function () {
      var context = { all: true, "Customer.io": false };
      var facade = new Facade({ context: context });
      strictEqual(facade.enabled("Customer.io"), false);
    });

    it("should use the providers.all", function () {
      var context = { providers: { all: false, "Customer.io": true } };
      var facade = new Facade({ context: context });
      strictEqual(facade.enabled("Customer.io"), true);
      strictEqual(facade.enabled("Google Analytics"), false);
    });

    it("should only use disabled integrations when explicitly enabled", function () {
      var facade = new Facade({});
      strictEqual(facade.enabled("Salesforce"), false);
      facade = new Facade({ context: { Salesforce: { x: 1 } } });
      strictEqual(facade.enabled("Salesforce"), true);
    });

    it("should fall back to old providers api", function () {
      var providers = { "Customer.io": false, Salesforce: true };
      var facade = new Facade({ context: { providers: providers } });
      strictEqual(facade.enabled("Customer.io"), false);
      strictEqual(facade.enabled("Salesforce"), true);
    });

    it("should pull from .integrations", function () {
      var integrations = { "Customer.io": false, Salesforce: true };
      var facade = new Facade({ integrations: integrations });
      strictEqual(facade.enabled("Customer.io"), false);
      strictEqual(facade.enabled("Salesforce"), true);
    });

    it("should pull from .integrations.all", function () {
      var facade = new Facade({ integrations: { all: false } });
      strictEqual(facade.enabled("Customer.io"), false);
    });
  });

  describe(".active()", function () {
    it("should be active by default", function () {
      var facade = new Facade({});
      strictEqual(facade.active(), true);
    });

    it("should be active if enabled", function () {
      var facade = new Facade({ context: { active: true } });
      strictEqual(facade.active(), true);
    });

    it("should not be active if disabled", function () {
      var facade = new Facade({ context: { active: false } });
      strictEqual(facade.active(), false);
    });
  });

  describe(".groupId()", function () {
    it("should proxy the groupId", function () {
      var groupId = "groupId";
      var facade = new Facade({ context: { groupId: groupId } });
      deepEqual(facade.groupId(), groupId);
    });
  });

  describe(".traits()", function () {
    it("should proxy the traits", function () {
      var traits = { someVal: 1 };
      var facade = new Facade({ context: { traits: traits } });
      deepEqual(facade.traits(), traits);
    });

    it("should return an empty object with no traits", function () {
      var facade = new Facade({});
      deepEqual(facade.traits(), {});
    });

    it("should mixin id if available", function () {
      var id = 123;
      var facade = new Facade({ userId: id });
      deepEqual(facade.traits(), { id: id });
    });

    it("should respect aliases", function () {
      var facade = new Facade({
        context: { traits: { a: "b", c: "c", email: "a@b.com" } },
      });
      deepEqual(facade.traits({ a: "b", email: "$email" }), {
        $email: "a@b.com",
        b: "b",
        c: "c",
      });
    });
  });

  describe(".channel()", function () {
    it("should return the channel", function () {
      var channel = "english";
      var facade = new Facade({ channel: channel });
      deepEqual(facade.channel(), channel);
    });
  });

  describe(".timezone()", function () {
    it("should return the timezone", function () {
      var timezone = "America/New_York";
      var facade = new Facade({ context: { timezone: timezone } });
      deepEqual(facade.timezone(), timezone);
    });
  });

  describe(".timestamp()", function () {
    it("should return the current timestamp if none is supplied", function () {
      var facade = new Facade({});
      notStrictEqual(facade.timestamp(), undefined);
    });

    it("should return the specified timestamp", function () {
      var timestamp = new Date();
      var facade = new Facade({ timestamp: timestamp });
      deepEqual(facade.timestamp(), timestamp);
      clock.tick(10);
      notEqual(new Date(), timestamp);
    });

    it("should cast timestamps to dates", function () {
      var facade = new Facade({ timestamp: "5/12/2015" });
      deepEqual(facade.timestamp(), new Date("5/12/2015"));
    });

    it("should cast ms to date", function () {
      var d = new Date().getTime();
      var facade = new Facade({ timestamp: d });
      deepEqual(facade.timestamp().getTime(), d);
    });
  });

  describe(".userAgent()", function () {
    it("should return the userAgent in context", function () {
      var facade = new Facade({ context: { userAgent: "safari" } });
      deepEqual(facade.userAgent(), "safari");
    });

    it("should return the userAgent in context", function () {
      var facade = new Facade({ context: { userAgent: "safari" } });
      deepEqual(facade.userAgent(), "safari");
    });
  });

  describe(".ip()", function () {
    it("should return the ip in context", function () {
      var ip = "4.8.15.16";
      var facade = new Facade({ context: { ip: ip } });
      deepEqual(facade.ip(), ip);
    });

    it("should return the ip in context", function () {
      var ip = "4.8.15.16";
      var facade = new Facade({ context: { ip: ip } });
      deepEqual(facade.ip(), ip);
    });
  });

  describe(".library()", function () {
    it("should return unknown if library is not present", function () {
      deepEqual(new Facade({}).library(), { name: "unknown", version: null });
    });

    it("should detect a library that is a string", function () {
      deepEqual(
        new Facade({ options: { library: "analytics-node" } }).library(),
        { name: "analytics-node", version: null }
      );
    });

    it("should detect a library that is an object", function () {
      deepEqual(
        new Facade({
          options: { library: { name: "analytics-node", version: 1.0 } },
        }).library(),
        { name: "analytics-node", version: 1.0 }
      );
    });
  });

  describe(".device()", function () {
    it("should return the device", function () {
      var facade = new Facade({ context: { device: { token: "token" } } });
      deepEqual(facade.device(), { token: "token" });
    });

    it("should handle device set as null", function () {
      var facade = new Facade({ context: { device: null } }, {clone: true});
      deepEqual(facade.device(), {});
    });

    it("should leave existing device-types untouched", function () {
      var facade = new Facade({
        context: {
          library: { name: "analytics-ios" },
          device: { type: "browser" },
        },
      });
      deepEqual(facade.device().type, "browser");
    });

    it("should infer device.type when library.name is analytics-ios", function () {
      var ios = { name: "analytics-ios" };
      var facade = new Facade({ context: { library: ios } });
      deepEqual(facade.device().type, "ios");
    });

    it("should infer device.type when library.name is analytics-android", function () {
      var android = { name: "analytics-android" };
      var facade = new Facade({ context: { library: android } });
      deepEqual(facade.device().type, "android");
    });
  });

  describe(".city()", function () {
    it("should pull from traits.address.city", function () {
      var msg = new Facade({
        context: {
          traits: { address: { city: "city" } },
        },
      });
      deepEqual(msg.city(), "city");
    });

    it("should pull from traits.city", function () {
      var msg = new Facade({ context: { traits: { city: "city" } } });
      deepEqual(msg.city(), "city");
    });
  });

  describe(".country()", function () {
    it("should pull from traits.address.country", function () {
      var msg = new Facade({
        context: {
          traits: { address: { country: "country" } },
        },
      });
      deepEqual(msg.country(), "country");
    });

    it("should pull from traits.country", function () {
      var msg = new Facade({ context: { traits: { country: "country" } } });
      deepEqual(msg.country(), "country");
    });
  });

  describe(".state()", function () {
    it("should pull from traits.address.state", function () {
      var msg = new Facade({
        context: {
          traits: { address: { state: "state" } },
        },
      });
      deepEqual(msg.state(), "state");
    });

    it("should pull from traits.state", function () {
      var msg = new Facade({ context: { traits: { state: "state" } } });
      deepEqual(msg.state(), "state");
    });
  });

  describe(".region()", function () {
    it("should pull from traits.address.region", function () {
      var msg = new Facade({
        context: {
          traits: { address: { region: "region" } },
        },
      });
      deepEqual(msg.region(), "region");
    });

    it("should pull from traits.region", function () {
      var msg = new Facade({ context: { traits: { region: "region" } } });
      deepEqual(msg.region(), "region");
    });
  });

  describe(".street()", function () {
    it("should pull from traits.address.street", function () {
      var msg = new Facade({
        context: {
          traits: { address: { street: "street" } },
        },
      });
      deepEqual(msg.street(), "street");
    });

    it("should pull from traits.street", function () {
      var msg = new Facade({ context: { traits: { street: "street" } } });
      deepEqual(msg.street(), "street");
    });
  });

  describe(".zip()", function () {
    it("should pull from traits.address.zip", function () {
      var msg = new Facade({
        context: {
          traits: { address: { zip: "zip" } },
        },
      });
      deepEqual(msg.zip(), "zip");
    });

    it("should pull from traits.zip", function () {
      var msg = new Facade({ context: { traits: { zip: "zip" } } });
      deepEqual(msg.zip(), "zip");
    });

    it("should pull from traits.address.postalCode", function () {
      var msg = new Facade({
        context: {
          traits: { address: { postalCode: "postalCode" } },
        },
      });
      deepEqual(msg.zip(), "postalCode");
    });

    it("should pull from traits.postalCode", function () {
      var msg = new Facade({
        context: { traits: { postalCode: "postalCode" } },
      });
      deepEqual(msg.zip(), "postalCode");
    });
  });
});
