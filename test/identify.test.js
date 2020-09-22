"use strict";

import { Identify } from "../lib";
import { strictEqual, deepEqual } from "proclaim";
import { parse } from "@segment/isodate";

describe("Identify", function () {
  var obj = {
    userId: "123",
    sessionId: "4.8.15.16.23.42",
  };
  var identify = new Identify(obj);

  describe(".type()", function () {
    it("should have the proper .type()", function () {
      strictEqual(identify.type(), "identify");
    });

    it("should equal .action()", function () {
      deepEqual(identify.type(), identify.action());
    });
  });

  describe(".userId()", function () {
    it("should proxy the userId", function () {
      deepEqual(identify.userId(), obj.userId);
    });
  });

  describe(".sessionId()", function () {
    it("should proxy the sessionId", function () {
      deepEqual(identify.sessionId(), obj.sessionId);
    });

    it("should proxy .anonymousId", function () {
      var obj = { anonymousId: "id" };
      var identify = new Identify(obj);
      deepEqual(identify.anonymousId(), obj.anonymousId);
    });
  });

  describe(".traits()", function () {
    it("should proxy the traits", function () {
      var traits = { a: "b", c: [1, 2, 3] };
      var identify = new Identify({ traits: traits });
      deepEqual(identify.traits(), traits);
    });

    it("should return an empty object if no traits are given", function () {
      var identify = new Identify({});
      deepEqual(identify.traits(), {});
    });

    it("should mixin id if available", function () {
      var identify = new Identify(obj);
      deepEqual(identify.traits(), { id: "123" });
    });

    it("should respect aliases", function () {
      var identify = new Identify({
        traits: { a: "b", c: "c", email: "a@b.com" },
      });
      deepEqual(identify.traits({ a: "b", email: "$email" }), {
        $email: "a@b.com",
        b: "b",
        c: "c",
      });
    });

    it("should respect aliases which are a 1-1 mapping", function () {
      var identify = new Identify({
        traits: {
          firstName: "firstName",
          lastName: "lastName",
        },
      });
      deepEqual(identify.traits({ name: "name" }), {
        name: "firstName lastName",
        firstName: "firstName",
        lastName: "lastName",
      });
    });
  });

  describe(".email()", function () {
    var email = "calvin@segment.io";
    it("should proxy the email from traits", function () {
      var identify = new Identify({ userId: "x", traits: { email: email } });
      deepEqual(identify.email(), email);
    });

    it("should proxy the email from userId", function () {
      var identify = new Identify({ userId: email });
      deepEqual(identify.email(), email);
    });
  });

  describe(".created()", function () {
    var created = new Date();

    it("should proxy from createdAt", function () {
      var identify = new Identify({ traits: { createdAt: created } });
      deepEqual(identify.created(), created);
    });

    it("should proxy from created", function () {
      var identify = new Identify({ traits: { created: created } });
      deepEqual(identify.created(), created);
    });

    it("should turn unix timestamps into dates", function () {
      var identify = new Identify({ traits: { created: 1374193002 } });
      deepEqual(identify.created(), new Date(1374193002000));
    });

    it("should turn strings into dates", function () {
      var identify = new Identify({
        traits: {
          created: "2013-07-18T23:58:38.555Z",
        },
      });
      deepEqual(identify.created(), parse("2013-07-18T23:58:38.555Z"));
    });
  });

  describe(".companyCreated()", function () {
    it("should proxy from company.createdAt", function () {
      var createdAt = new Date();
      var identify = new Identify({
        traits: {
          company: { createdAt: createdAt },
        },
      });
      deepEqual(identify.companyCreated(), createdAt);
    });

    it("should proxy from company.created", function () {
      var createdAt = new Date();
      var identify = new Identify({
        traits: {
          company: { created: createdAt },
        },
      });
      deepEqual(identify.companyCreated(), createdAt);
    });

    it("should turn unix timestamps into dates", function () {
      var createdAt = 1374193002;
      var identify = new Identify({
        traits: {
          company: { created: createdAt },
        },
      });
      deepEqual(identify.companyCreated(), new Date(1374193002000));
    });

    it("should turn ISO datestrings into dates", function () {
      var createdAt = "2013-07-18T23:58:38.555Z";
      var identify = new Identify({
        traits: {
          company: { created: createdAt },
        },
      });
      deepEqual(identify.companyCreated(), new Date(1374191918555));
    });
  });

  describe(".companyName()", function () {
    it("should proxy from company.name", function () {
      var identify = new Identify({
        traits: {
          company: { name: "Example Company" },
        },
      });
      deepEqual(identify.companyName(), "Example Company");
    });
  });

  describe(".name()", function () {
    var name = "Freddie Mercury";
    var firstName = name.split(" ")[0];
    var lastName = name.split(" ")[1];

    it("should pull name from a passed in name", function () {
      var identify = new Identify({ traits: { name: name } });
      deepEqual(identify.name(), name);
    });

    it("should pull name from a firstName/lastName pair", function () {
      var identify = new Identify({
        traits: {
          firstName: firstName,
          lastName: lastName,
        },
      });
      deepEqual(identify.name(), firstName + " " + lastName);
    });

    it("should not throw on a non-string", function () {
      var identify = new Identify({
        traits: {
          name: {},
        },
      });
      deepEqual(identify.name(), undefined);
    });

    it("should not throw on a non-string pair", function () {
      var identify = new Identify({
        traits: {
          firstName: {},
          lastName: {},
        },
      });
      deepEqual(identify.name(), undefined);
    });
  });

  describe(".firstName()", function () {
    var name = "Freddie Mercury";
    var firstName = name.split(" ")[0];

    it("should pull from a passed in firstName", function () {
      var identify = new Identify({ traits: { firstName: firstName } });
      deepEqual(identify.firstName(), firstName);
    });

    it("should pull from a passed in name", function () {
      var identify = new Identify({ traits: { name: name } });
      deepEqual(identify.firstName(), firstName);
    });

    it("should not fail on a non-string", function () {
      var identify = new Identify({
        traits: {
          firstName: {},
        },
      });
      deepEqual(identify.firstName(), undefined);
    });
  });

  describe(".lastName()", function () {
    var name = "Freddie Mercury";
    var lastName = name.split(" ")[1];

    it("should pull from a passed in lastName", function () {
      var identify = new Identify({ traits: { lastName: lastName } });
      deepEqual(identify.lastName(), lastName);
    });

    it("should pull from a passed in name", function () {
      var identify = new Identify({ traits: { name: name } });
      deepEqual(identify.lastName(), lastName);
    });

    it("should split and trim the full lastName properly", function () {
      var identify = new Identify({ traits: { name: "Freddie  Mercury III" } });
      deepEqual(identify.lastName(), "Mercury III");
    });

    it("should not fail on a non-string", function () {
      var identify = new Identify({
        traits: {
          lastName: {},
        },
      });
      deepEqual(identify.lastName(), undefined);
    });
  });

  describe(".username()", function () {
    it("should pull from a passed in username", function () {
      var identify = new Identify({ traits: { username: "calvinfo" } });
      deepEqual(identify.username(), "calvinfo");
    });
  });

  describe(".uid()", function () {
    it("should pull the userId", function () {
      var identify = new Identify({ userId: "id" });
      deepEqual(identify.uid(), "id");
    });

    it("should pull the username", function () {
      var identify = new Identify({ traits: { username: "username" } });
      deepEqual(identify.uid(), "username");
    });

    it("should pull the email", function () {
      var identify = new Identify({ traits: { email: "email@example.com" } });
      deepEqual(identify.uid(), "email@example.com");
    });

    it("should prefer userId", function () {
      var identify = new Identify({
        userId: "id",
        traits: {
          username: "user",
          email: "email",
        },
      });

      deepEqual(identify.uid(), "id");
    });
  });

  describe(".gender()", function () {
    it("should return the gender", function () {
      var msg = new Identify({ traits: { gender: "gender" } });
      deepEqual(msg.gender(), "gender");
    });
  });

  describe(".birthday()", function () {
    it("should the birthday", function () {
      var msg = new Identify({ traits: { birthday: Date("2014-01-01") } });
      deepEqual(msg.birthday(), Date("2014-01-01"));
    });
  });

  describe(".age()", function () {
    it("should return the age", function () {
      var msg = new Identify({ traits: { age: 24 } });
      deepEqual(msg.age(), 24);
    });

    it("should return null if .birthday() is not a date", function () {
      var msg = new Identify({ traits: { birthday: 1 } });
      deepEqual(msg.age(), undefined);
    });

    it("should compute the age from .birthday()", function () {
      var msg = new Identify({ traits: { birthday: parse("2000-01-01") } });
      var date = msg.birthday().getFullYear();
      var now = new Date().getFullYear();
      deepEqual(msg.age(), now - date);
    });
  });

  describe(".website()", function () {
    it("should pull from a passed in website", function () {
      var identify = new Identify({ traits: { website: "http://calv.info" } });
      deepEqual(identify.website(), "http://calv.info");
    });

    it("should pull from .website[0] if .website is omitted", function () {
      var msg = new Identify({ traits: { websites: ["http://calv.info"] } });
      deepEqual(msg.website(), "http://calv.info");
    });
  });

  describe(".websites()", function () {
    it("should pull from .websites", function () {
      var msg = new Identify({ traits: { websites: ["http://calv.info"] } });
      deepEqual(msg.websites(), ["http://calv.info"]);
    });

    it("should return [.website] if possible", function () {
      var msg = new Identify({ traits: { website: "http://calv.info" } });
      deepEqual(msg.websites(), ["http://calv.info"]);
    });

    it("should return an empty array if .websites and .website are missing", function () {
      var msg = new Identify({});
      deepEqual(msg.websites(), []);
    });
  });

  describe(".description()", function () {
    it("should pull from description", function () {
      var identify = new Identify({ traits: { description: "baz" } });
      deepEqual(identify.description(), "baz");
    });

    it("should pull from background", function () {
      var identify = new Identify({ traits: { background: "baz" } });
      deepEqual(identify.description(), "baz");
    });

    it("should prefer description", function () {
      var identify = new Identify({
        traits: {
          background: "baz",
          description: "foo",
        },
      });

      deepEqual(identify.description(), "foo");
    });
  });

  describe(".phone()", function () {
    it("should pull from a passed in phone", function () {
      var identify = new Identify({ traits: { phone: "555-555-5555" } });
      deepEqual(identify.phone(), "555-555-5555");
    });

    it("should pull from .phones[] when possible", function () {
      var msg = new Identify({ traits: { phones: ["555"] } });
      deepEqual(msg.phone(), "555");
    });
  });

  describe(".phones()", function () {
    it("should pull from .phones", function () {
      var msg = new Identify({ traits: { phones: [1, 2] } });
      deepEqual(msg.phones(), [1, 2]);
    });

    it("should fallback to [.phone]", function () {
      var msg = new Identify({ traits: { phone: 1 } });
      deepEqual(msg.phones(), [1]);
    });
  });

  describe(".address()", function () {
    it("should pull from a passed in address", function () {
      var identify = new Identify({ traits: { address: "461 2nd St." } });
      deepEqual(identify.address(), "461 2nd St.");
    });
  });

  describe(".avatar()", function () {
    it("should pull from passed in avatar", function () {
      var identify = new Identify({
        traits: { avatar: "//avatars/avatar.jpg" },
      });
      deepEqual(identify.avatar(), "//avatars/avatar.jpg");
    });

    it("should fallback to .photoUrl", function () {
      var identify = new Identify({ traits: { photo_url: "photo-url" } });
      deepEqual(identify.avatar(), "photo-url");
    });

    it("should fallback to .avatarUrl", function () {
      var msg = new Identify({ traits: { avatarUrl: "avatar-url" } });
      deepEqual(msg.avatar(), "avatar-url");
    });
  });

  describe(".position()", function () {
    it("should proxy the position", function () {
      var identify = new Identify({ traits: { position: "position" } });
      deepEqual(identify.position(), "position");
    });

    it("should fallback to .jobTitle", function () {
      var identify = new Identify({ traits: { jobTitle: "position" } });
      deepEqual(identify.position(), "position");
    });
  });
});
