"use strict";

import { Alias } from "../lib";
import { deepEqual, strictEqual } from "proclaim";

describe("Alias", function () {
  var alias;

  beforeEach(function () {
    alias = new Alias({
      from: "from",
      to: "to",
    });
  });

  describe(".type()", function () {
    var alias = new Alias({});
    it("should have the proper .type()", function () {
      deepEqual(alias.type(), "alias");
    });

    it("should equal .action()", function () {
      deepEqual(alias.type(), alias.action());
    });
  });

  describe(".from()", function () {
    it("should alias .previousId", function () {
      strictEqual(alias.from, alias.previousId);
    });

    it("should proxy .from", function () {
      var alias = new Alias({ from: "x" });
      deepEqual(alias.from(), "x");
    });

    it("should proxy .previousId", function () {
      var alias = new Alias({ previousId: "x" });
      deepEqual(alias.from(), "x");
    });
  });

  describe(".to()", function () {
    it("should alias .userId", function () {
      strictEqual(alias.to, alias.userId);
    });

    it("should proxy .to", function () {
      var alias = new Alias({ to: "x" });
      deepEqual(alias.to(), "x");
    });

    it("should proxy .userId", function () {
      var alias = new Alias({ userId: "x" });
      deepEqual(alias.to(), "x");
    });
  });
});
