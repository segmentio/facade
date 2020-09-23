"use strict";

import { Group } from "../lib";
import { strictEqual, deepEqual } from "assert";

describe("Group", function () {
  var obj = {
    userId: "1",
    sessionId: "2",
    groupId: "1",
    traits: {
      trait: true,
    },
  };
  var group = new Group(obj);

  describe(".type()", function () {
    it("should have the proper .type()", function () {
      strictEqual(group.type(), "group");
    });

    it("should equal .action()", function () {
      deepEqual(group.type(), group.action());
    });
  });

  describe(".groupId()", function () {
    it("should proxy the group id", function () {
      deepEqual(group.groupId(), obj.groupId);
    });
  });

  describe(".properties()", function () {
    it("should proxy properties", function () {
      var obj = {};
      var g = new Group({ properties: obj });
      deepEqual(g.properties(), obj);
    });
  });

  describe(".userId()", function () {
    it("should proxy the userId", function () {
      deepEqual(group.userId(), obj.userId);
    });
  });

  describe(".sessionId()", function () {
    it("should proxy the sessionId", function () {
      deepEqual(group.sessionId(), obj.sessionId);
    });
  });

  describe(".created()", function () {
    var at = new Date();

    it("should proxy created", function () {
      var opts = { traits: { created: at } };
      var g = new Group(opts);
      deepEqual(g.created(), at);
    });

    it("should proxy createdAt", function () {
      var opts = { traits: { createdAt: at } };
      var g = new Group(opts);
      deepEqual(g.created(), at);
    });

    it("should turn strings into dates", function () {
      var str = "2013-07-18T23:58:38.555Z";
      var g = new Group({ properties: { created: str } });
      deepEqual(g.created(), new Date(1374191918555));
    });

    it("should return undefined if date was not found", function () {
      var group = new Group({ properties: {} });
      deepEqual(group.created(), undefined);
    });
  });

  describe(".type()", function () {
    it('should return "group"', function () {
      strictEqual(group.type(), "group");
    });

    it("should respond to .action()", function () {
      strictEqual(group.action(), "group");
    });
  });

  describe(".groupId()", function () {
    it("should proxy the groupId", function () {
      deepEqual(group.groupId(), obj.userId);
    });
  });

  describe(".userId()", function () {
    it("should proxy the userId", function () {
      deepEqual(group.userId(), obj.userId);
    });
  });

  describe(".traits()", function () {
    it("should proxy traits", function () {
      deepEqual(group.traits(), { trait: true, id: "1" });
    });

    it("should return an empty object if traits is undefined", function () {
      deepEqual(new Group({}).traits(), {});
    });

    it("should respect aliases", function () {
      var group = new Group({ traits: { a: 1, b: 2 } });
      deepEqual(group.traits({ a: 1 }), { 1: 1, b: 2 });
    });
  });

  describe(".properties()", function () {
    it("should proxy traits", function () {
      deepEqual(group.properties(), obj.traits);
    });

    it("should proxy properties if theres no traits", function () {
      var group = new Group({ properties: { prop: true } });
      deepEqual(group.properties(), { prop: true });
    });
  });

  describe(".employees()", function () {
    it("should proxy employees", function () {
      var msg = new Group({ traits: { employees: 50 } });
      deepEqual(msg.employees(), 50);
    });
  });

  describe(".industry()", function () {
    it("should proxy industry", function () {
      var msg = new Group({ traits: { industry: "tech" } });
      deepEqual(msg.industry(), "tech");
    });
  });

  describe(".name()", function () {
    it("should proxy name", function () {
      var msg = new Group({ traits: { name: "tech" } });
      deepEqual(msg.name(), "tech");
    });
  });

  describe(".email()", function () {
    it("should proxy email", function () {
      var msg = new Group({ traits: { email: "email@example.com" } });
      deepEqual(msg.email(), "email@example.com");
    });

    it("should fallback to .groupId if its a valid email", function () {
      var msg = new Group({ groupId: "email@example.com" });
      deepEqual(msg.email(), "email@example.com");
    });

    it("should not return the .groupId if its an invalid email", function () {
      var msg = new Group({ groupId: 23 });
      deepEqual(msg.email(), undefined);
    });
  });
});
