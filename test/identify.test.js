'use strict';

var Identify = require('../lib').Identify;
var assert = require('proclaim');
var isodate = require('@segment/isodate');

describe('Identify', function() {
  var obj = {
    userId: '123',
    sessionId: '4.8.15.16.23.42'
  };
  var identify = new Identify(obj);

  describe('.type()', function() {
    it('should have the proper .type()', function() {
      assert.strictEqual(identify.type(), 'identify');
    });

    it('should equal .action()', function() {
      assert.deepEqual(identify.type(), identify.action());
    });
  });

  describe('.userId()', function() {
    it('should proxy the userId', function() {
      assert.deepEqual(identify.userId(), obj.userId);
    });
  });

  describe('.sessionId()', function() {
    it('should proxy the sessionId', function() {
      assert.deepEqual(identify.sessionId(), obj.sessionId);
    });

    it('should proxy .anonymousId', function() {
      var obj = { anonymousId: 'id' };
      var identify = new Identify(obj);
      assert.deepEqual(identify.anonymousId(), obj.anonymousId);
    });
  });

  describe('.traits()', function() {
    it('should proxy the traits', function() {
      var traits = { a: 'b', c: [1, 2, 3] };
      var identify = new Identify({ traits: traits });
      assert.deepEqual(identify.traits(), traits);
    });

    it('should return an empty object if no traits are given', function() {
      var identify = new Identify({});
      assert.deepEqual(identify.traits(), {});
    });

    it('should mixin id if available', function() {
      var identify = new Identify(obj);
      assert.deepEqual(identify.traits(), { id: '123' });
    });

    it('should respect aliases', function() {
      var identify = new Identify({ traits: { a: 'b', c: 'c', email: 'a@b.com' } });
      assert.deepEqual(
        identify.traits({ a: 'b', email: '$email' }),
        { $email: 'a@b.com', b: 'b', c: 'c' }
      );
    });

    it('should respect aliases which are a 1-1 mapping', function() {
      var identify = new Identify({
        traits: {
          firstName: 'firstName',
          lastName: 'lastName'
        }
      });
      assert.deepEqual(
        identify.traits({ name: 'name' }),
        { name: 'firstName lastName', firstName: 'firstName', lastName: 'lastName' }
      );
    });
  });

  describe('.email()', function() {
    var email = 'calvin@segment.io';
    it('should proxy the email from traits', function() {
      var identify = new Identify({ userId: 'x', traits: { email: email } });
      assert.deepEqual(identify.email(), email);
    });

    it('should proxy the email from userId', function() {
      var identify = new Identify({ userId: email });
      assert.deepEqual(identify.email(), email);
    });
  });

  describe('.created()', function() {
    var created = new Date();

    it('should proxy from createdAt', function() {
      var identify = new Identify({ traits: { createdAt: created } });
      assert.deepEqual(identify.created(), created);
    });

    it('should proxy from created', function() {
      var identify = new Identify({ traits: { created: created } });
      assert.deepEqual(identify.created(), created);
    });

    it('should turn unix timestamps into dates', function() {
      var identify = new Identify({ traits: { created: 1374193002 } });
      assert.deepEqual(identify.created(), new Date(1374193002000));
    });

    it('should turn strings into dates', function() {
      var identify = new Identify({
        traits: {
          created: '2013-07-18T23:58:38.555Z'
        }
      });
      assert.deepEqual(identify.created(), isodate.parse('2013-07-18T23:58:38.555Z'));
    });
  });

  describe('.companyCreated()', function() {
    it('should proxy from company.createdAt', function() {
      var createdAt = new Date();
      var identify = new Identify({
        traits: {
          company: { createdAt: createdAt }
        }
      });
      assert.deepEqual(identify.companyCreated(), createdAt);
    });

    it('should proxy from company.created', function() {
      var createdAt = new Date();
      var identify = new Identify({
        traits: {
          company: { created: createdAt }
        }
      });
      assert.deepEqual(identify.companyCreated(), createdAt);
    });

    it('should turn unix timestamps into dates', function() {
      var createdAt = 1374193002;
      var identify = new Identify({
        traits: {
          company: { created: createdAt }
        }
      });
      assert.deepEqual(identify.companyCreated(), new Date(1374193002000));
    });

    it('should turn ISO datestrings into dates', function() {
      var createdAt = '2013-07-18T23:58:38.555Z';
      var identify = new Identify({
        traits: {
          company: { created: createdAt }
        }
      });
      assert.deepEqual(identify.companyCreated(), new Date(1374191918555));
    });
  });

  describe('.companyName()', function() {
    it('should proxy from company.name', function() {
      var identify = new Identify({
        traits: {
          company: { name: 'Example Company' }
        }
      });
      assert.deepEqual(identify.companyName(), 'Example Company');
    });
  });

  describe('.name()', function() {
    var name = 'Freddie Mercury';
    var firstName = name.split(' ')[0];
    var lastName = name.split(' ')[1];

    it('should pull name from a passed in name', function() {
      var identify = new Identify({ traits: { name: name } });
      assert.deepEqual(identify.name(), name);
    });

    it('should pull name from a firstName/lastName pair', function() {
      var identify = new Identify({
        traits: {
          firstName: firstName,
          lastName: lastName
        }
      });
      assert.deepEqual(identify.name(), firstName + ' ' + lastName);
    });

    it('should not throw on a non-string', function() {
      var identify = new Identify({
        traits: {
          name: {}
        }
      });
      assert.deepEqual(identify.name(), undefined);
    });

    it('should not throw on a non-string pair', function() {
      var identify = new Identify({
        traits: {
          firstName: {},
          lastName: {}
        }
      });
      assert.deepEqual(identify.name(), undefined);
    });
  });

  describe('.firstName()', function() {
    var name = 'Freddie Mercury';
    var firstName = name.split(' ')[0];

    it('should pull from a passed in firstName', function() {
      var identify = new Identify({ traits: { firstName: firstName } });
      assert.deepEqual(identify.firstName(), firstName);
    });

    it('should pull from a passed in name', function() {
      var identify = new Identify({ traits: { name: name } });
      assert.deepEqual(identify.firstName(), firstName);
    });

    it('should not fail on a non-string', function() {
      var identify = new Identify({
        traits: {
          firstName: {}
        }
      });
      assert.deepEqual(identify.firstName(), undefined);
    });
  });

  describe('.lastName()', function() {
    var name = 'Freddie Mercury';
    var lastName = name.split(' ')[1];

    it('should pull from a passed in lastName', function() {
      var identify = new Identify({ traits: { lastName: lastName } });
      assert.deepEqual(identify.lastName(), lastName);
    });

    it('should pull from a passed in name', function() {
      var identify = new Identify({ traits: { name: name } });
      assert.deepEqual(identify.lastName(), lastName);
    });

    it('should split and trim the full lastName properly', function() {
      var identify = new Identify({ traits: { name: 'Freddie  Mercury III' } });
      assert.deepEqual(identify.lastName(), 'Mercury III');
    });

    it('should not fail on a non-string', function() {
      var identify = new Identify({
        traits: {
          lastName: {}
        }
      });
      assert.deepEqual(identify.lastName(), undefined);
    });
  });

  describe('.username()', function() {
    it('should pull from a passed in username', function() {
      var identify = new Identify({ traits: { username: 'calvinfo' } });
      assert.deepEqual(identify.username(), 'calvinfo');
    });
  });

  describe('.uid()', function() {
    it('should pull the userId', function() {
      var identify = new Identify({ userId: 'id' });
      assert.deepEqual(identify.uid(), 'id');
    });

    it('should pull the username', function() {
      var identify = new Identify({ traits: { username: 'username' } });
      assert.deepEqual(identify.uid(), 'username');
    });

    it('should pull the email', function() {
      var identify = new Identify({ traits: { email: 'email@example.com' } });
      assert.deepEqual(identify.uid(), 'email@example.com');
    });

    it('should prefer userId', function() {
      var identify = new Identify({
        userId: 'id',
        traits: {
          username: 'user',
          email: 'email'
        }
      });

      assert.deepEqual(identify.uid(), 'id');
    });
  });

  describe('.gender()', function() {
    it('should return the gender', function() {
      var msg = new Identify({ traits: { gender: 'gender' } });
      assert.deepEqual(msg.gender(), 'gender');
    });
  });

  describe('.birthday()', function() {
    it('should the birthday', function() {
      var msg = new Identify({ traits: { birthday: Date('2014-01-01') } });
      assert.deepEqual(msg.birthday(), Date('2014-01-01'));
    });
  });

  describe('.age()', function() {
    it('should return the age', function() {
      var msg = new Identify({ traits: { age: 24 } });
      assert.deepEqual(msg.age(), 24);
    });

    it('should return null if .birthday() is not a date', function() {
      var msg = new Identify({ traits: { birthday: 1 } });
      assert.deepEqual(msg.age(), undefined);
    });

    it('should compute the age from .birthday()', function() {
      var msg = new Identify({ traits: { birthday: isodate.parse('2000-01-01') } });
      var date = msg.birthday().getFullYear();
      var now = new Date().getFullYear();
      assert.deepEqual(msg.age(), now - date);
    });
  });

  describe('.website()', function() {
    it('should pull from a passed in website', function() {
      var identify = new Identify({ traits: { website: 'http://calv.info' } });
      assert.deepEqual(identify.website(), 'http://calv.info');
    });

    it('should pull from .website[0] if .website is omitted', function() {
      var msg = new Identify({ traits: { websites: ['http://calv.info'] } });
      assert.deepEqual(msg.website(), 'http://calv.info');
    });
  });

  describe('.websites()', function() {
    it('should pull from .websites', function() {
      var msg = new Identify({ traits: { websites: ['http://calv.info'] } });
      assert.deepEqual(msg.websites(), ['http://calv.info']);
    });

    it('should return [.website] if possible', function() {
      var msg = new Identify({ traits: { website: 'http://calv.info' } });
      assert.deepEqual(msg.websites(), ['http://calv.info']);
    });

    it('should return an empty array if .websites and .website are missing', function() {
      var msg = new Identify({});
      assert.deepEqual(msg.websites(), []);
    });
  });

  describe('.description()', function() {
    it('should pull from description', function() {
      var identify = new Identify({ traits: { description: 'baz' } });
      assert.deepEqual(identify.description(), 'baz');
    });

    it('should pull from background', function() {
      var identify = new Identify({ traits: { background: 'baz' } });
      assert.deepEqual(identify.description(), 'baz');
    });

    it('should prefer description', function() {
      var identify = new Identify({ traits: {
        background: 'baz',
        description: 'foo'
      } });

      assert.deepEqual(identify.description(), 'foo');
    });
  });

  describe('.phone()', function() {
    it('should pull from a passed in phone', function() {
      var identify = new Identify({ traits: { phone: '555-555-5555' } });
      assert.deepEqual(identify.phone(), '555-555-5555');
    });

    it('should pull from .phones[] when possible', function() {
      var msg = new Identify({ traits: { phones: ['555'] } });
      assert.deepEqual(msg.phone(), '555');
    });
  });

  describe('.phones()', function() {
    it('should pull from .phones', function() {
      var msg = new Identify({ traits: { phones: [1, 2] } });
      assert.deepEqual(msg.phones(), [1, 2]);
    });

    it('should fallback to [.phone]', function() {
      var msg = new Identify({ traits: { phone: 1 } });
      assert.deepEqual(msg.phones(), [1]);
    });
  });

  describe('.address()', function() {
    it('should pull from a passed in address', function() {
      var identify = new Identify({ traits: { address: '461 2nd St.' } });
      assert.deepEqual(identify.address(), '461 2nd St.');
    });
  });

  describe('.avatar()', function() {
    it('should pull from passed in avatar', function() {
      var identify = new Identify({ traits: { avatar: '//avatars/avatar.jpg' } });
      assert.deepEqual(identify.avatar(), '//avatars/avatar.jpg');
    });

    it('should fallback to .photoUrl', function() {
      var identify = new Identify({ traits: { photo_url: 'photo-url' } });
      assert.deepEqual(identify.avatar(), 'photo-url');
    });

    it('should fallback to .avatarUrl', function() {
      var msg = new Identify({ traits: { avatarUrl: 'avatar-url' } });
      assert.deepEqual(msg.avatar(), 'avatar-url');
    });
  });

  describe('.position()', function() {
    it('should proxy the position', function() {
      var identify = new Identify({ traits: { position: 'position' } });
      assert.deepEqual(identify.position(), 'position');
    });

    it('should fallback to .jobTitle', function() {
      var identify = new Identify({ traits: { jobTitle: 'position' } });
      assert.deepEqual(identify.position(), 'position');
    });
  });
});
