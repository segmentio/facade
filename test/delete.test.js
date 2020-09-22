"use strict";

import { Delete } from "../lib";
import { strictEqual, deepEqual } from "assert";

describe("Delete", function () {
  var obj = {
    userId: "1",
  };
  var delete_ = new Delete(obj); // delete is a reserved keyword in js

  describe(".type()", function () {
    it("should have the proper .type()", function () {
      strictEqual(delete_.type(), "delete");
    });
  });

  describe(".userId()", function () {
    it("should proxy the userId", function () {
      deepEqual(delete_.userId(), obj.userId);
    });
  });
});
