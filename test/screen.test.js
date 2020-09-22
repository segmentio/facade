"use strict";

import { Screen } from "../lib";
import { Track } from "../lib";
import assert, { deepEqual, strictEqual } from "proclaim";
import newDate from "new-date";

describe("Screen", function () {
  var obj;
  var screen;

  beforeEach(function () {
    obj = {};
    obj.userId = 2;
    obj.sessionId = 3;
    obj.category = "songs";
    obj.name = "ab frank";
    screen = new Screen(obj);
  });

  describe(".type()", function () {
    it("should have the proper .type()", function () {
      deepEqual(screen.type(), "screen");
    });

    it("should equal .action()", function () {
      deepEqual(screen.type(), screen.action());
    });
  });

  describe(".category()", function () {
    it("should proxy category", function () {
      deepEqual(screen.category(), "songs");
    });
  });

  describe(".userId()", function () {
    it("should proxy the userId", function () {
      deepEqual(screen.userId(), obj.userId);
    });
  });

  describe(".sessionId()", function () {
    it("should proxy the sessionId", function () {
      deepEqual(screen.sessionId(), obj.sessionId);
    });
  });

  describe(".properties()", function () {
    it("should proxy properties", function () {
      var obj = {};
      var p = new Screen({ properties: obj });
      deepEqual(p.properties(), obj);
    });

    it("should default to an empty object if properties is undefined", function () {
      var screen = new Screen({});
      deepEqual(screen.properties(), {});
    });

    it("should mixin category and name", function () {
      var screen = new Screen({
        properties: { prop: true },
        category: "category",
        name: "name",
      });

      deepEqual(screen.properties(), {
        category: "category",
        name: "name",
        prop: true,
      });
    });
  });

  describe(".email()", function () {
    var email = "han@segment.com";

    it("should proxy the email from properties", function () {
      var screen = new Screen({ userId: "x", properties: { email: email } });
      deepEqual(screen.email(), email);
    });

    it("should proxy the email from userId", function () {
      var screen = new Screen({ userId: email });
      deepEqual(screen.email(), email);
    });

    it("should proxy the email from context.traits", function () {
      var screen = new Screen({ context: { traits: { email: email } } });
      deepEqual(screen.email(), email);
    });

    it("should not error if there is no email", function () {
      var screen = new Screen({});
      deepEqual(screen.email(), undefined);
    });
  });

  describe(".name()", function () {
    it("should proxy name", function () {
      deepEqual(screen.name(), obj.name);
    });
  });

  describe(".referrer()", function () {
    it("should proxy properties.referrer", function () {
      var screen = new Screen({ properties: { referrer: "url" } });
      deepEqual(screen.referrer(), "url");
    });

    it("should proxy context.referrer.url", function () {
      var screen = new Screen({ context: { referrer: { url: "url" } } });
      deepEqual(screen.referrer(), "url");
    });
  });

  describe(".event()", function () {
    it("should concat name if given", function () {
      var screen = new Screen({});
      deepEqual(screen.event("baz"), "Viewed baz Screen");
    });

    it('should return "Loaded a Screen" if name is omitted', function () {
      deepEqual(new Screen({}).event(), "Loaded a Screen");
    });
  });

  describe(".track()", function () {
    it("should convert the screen to track with event", function () {
      var screen = new Screen({
        anonymousId: "anon-id",
        userId: "user-id",
        context: { ip: "0.0.0.0" },
        timestamp: newDate("2014-01-01"),
        properties: { prop: true },
        category: "category",
        name: "name",
      });

      strictEqual(screen.track("event").anonymousId(), "anon-id");
      strictEqual(screen.track("event").userId(), "user-id");
      assert(screen.track("event") instanceof Track);
      deepEqual(screen.track().event(), "Loaded a Screen");
      deepEqual(screen.track("name").event(), "Viewed name Screen");
      deepEqual(screen.track("category").event(), "Viewed category Screen");
      deepEqual(screen.track("category").timestamp(), screen.timestamp());
      deepEqual(screen.track("category").context(), screen.context());
      deepEqual(screen.track("event").properties(), {
        category: "category",
        name: "name",
        prop: true,
      });
    });
  });

  describe(".fullName()", function () {
    it("should return only name if category is omitted", function () {
      var screen = new Screen({
        name: "baz",
      });

      deepEqual(screen.fullName(), "baz");
    });

    it("should return the category + name if available", function () {
      var screen = new Screen({
        category: "cat",
        name: "baz",
      });

      deepEqual(screen.fullName(), "cat baz");
    });
  });
});
