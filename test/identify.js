
var Identify = require('../lib').Identify;
var expect = require('expect.js');

describe('Identify', function() {
  var obj = {
    userId: '123',
    sessionId: '4.8.15.16.23.42'
  };
  var identify = new Identify(obj);

  describe('.type()', function() {
    it('should have the proper .type()', function() {
      expect(identify.type()).to.be('identify');
    });

    it('should equal .action()', function() {
      expect(identify.type()).to.eql(identify.action());
    });
  });

  describe('.userId()', function() {
    it('should proxy the userId', function() {
      expect(identify.userId()).to.eql(obj.userId);
    });
  });

  describe('.sessionId()', function() {
    it('should proxy the sessionId', function() {
      expect(identify.sessionId()).to.eql(obj.sessionId);
    });

    it('should proxy .anonymousId', function() {
      var obj = { anonymousId: 'id' };
      var identify = new Identify(obj);
      expect(identify.anonymousId()).to.eql(obj.anonymousId);
    });
  });

  describe('.traits()', function() {
    it('should proxy the traits', function() {
      var traits = { a: 'b', c: [1, 2, 3] };
      var identify = new Identify({ traits: traits });
      expect(identify.traits()).to.eql(traits);
    });

    it('should return an empty object if no traits are given', function() {
      var identify = new Identify({});
      expect(identify.traits()).to.eql({});
    });

    it('should mixin id if available', function() {
      var identify = new Identify(obj);
      expect(identify.traits()).to.eql({ id: '123' });
    });

    it('should respect aliases', function() {
      var identify = new Identify({ traits: { a: 'b', c: 'c', email: 'a@b.com' } });
      expect(identify.traits({ a: 'b', email: '$email' })).to.eql({
        $email: 'a@b.com',
        b: 'b',
        c: 'c'
      });
    });

    it('should respect aliases which are a 1-1 mapping', function() {
      var identify = new Identify({
        traits: {
          firstName: 'firstName',
          lastName: 'lastName'
        }
      });
      expect(identify.traits({ name: 'name' })).to.eql({
        name: 'firstName lastName',
        firstName: 'firstName',
        lastName: 'lastName'
      });
    });
  });

  describe('.email()', function() {
    var email = 'calvin@segment.io';
    it('should proxy the email from traits', function() {
      var identify = new Identify({ userId: 'x', traits: { email: email } });
      expect(identify.email()).to.eql(email);
    });

    it('should proxy the email from userId', function() {
      var identify = new Identify({ userId: email });
      expect(identify.email()).to.eql(email);
    });
  });

  describe('.created()', function() {
    var created = new Date();

    it('should proxy from createdAt', function() {
      var identify = new Identify({ traits: { createdAt: created } });
      expect(identify.created()).to.eql(created);
    });

    it('should proxy from created', function() {
      var identify = new Identify({ traits: { created: created } });
      expect(identify.created()).to.eql(created);
    });

    it('should turn unix timestamps into dates', function() {
      var identify = new Identify({ traits: { created: 1374193002 } });
      expect(identify.created()).to.eql(new Date(1374193002000));
    });

    it('should turn strings into dates', function() {
      var identify = new Identify({
        traits: {
          created: '2013-07-18T23:58:38.555Z'
        }
      });
      expect(identify.created()).to.eql(new Date('2013-07-18T23:58:38.555Z'));
    });
  });

  describe('.companyCreated()', function() {
    var traits = { company: {} };

    it('should proxy from company.createdAt', function() {
      var date = traits.company.createdAt = new Date();
      var identify = new Identify({ traits: traits });
      expect(identify.companyCreated()).to.eql(date);
    });

    it('should proxy from company.created', function() {
      var date = traits.company.created = new Date();
      var identify = new Identify({ traits: traits });
      expect(identify.companyCreated()).to.eql(date);
    });

    it('should turn unix timestamps into dates', function() {
      traits.company.created = 1374193002;
      var identify = new Identify({ traits: traits });
      expect(identify.companyCreated()).to.eql(new Date(1374193002000));
    });

    it('should turn strings into dates', function() {
      var str = '2013-07-18T23:58:38.555Z';
      traits.company.created = str;
      var identify = new Identify({ traits: traits });
      expect(identify.companyCreated()).to.eql(new Date(str));
    });
  });

  describe('.name()', function() {
    var name = 'Freddie Mercury';
    var firstName = name.split(' ')[0];
    var lastName = name.split(' ')[1];

    it('should pull name from a passed in name', function() {
      var identify = new Identify({ traits: { name: name } });
      expect(identify.name()).to.eql(name);
    });

    it('should pull name from a firstName/lastName pair', function() {
      var identify = new Identify({
        traits: {
          firstName: firstName,
          lastName: lastName
        }
      });
      expect(identify.name()).to.eql(firstName + ' ' + lastName);
    });

    it('should not throw on a non-string', function() {
      var identify = new Identify({
        traits: {
          name: {}
        }
      });
      expect(identify.name()).to.eql(undefined);
    });

    it('should not throw on a non-string pair', function() {
      var identify = new Identify({
        traits: {
          firstName: {},
          lastName: {}
        }
      });
      expect(identify.name()).to.eql(undefined);
    });
  });

  describe('.firstName()', function() {
    var name = 'Freddie Mercury';
    var firstName = name.split(' ')[0];

    it('should pull from a passed in firstName', function() {
      var identify = new Identify({ traits: { firstName: firstName } });
      expect(identify.firstName()).to.eql(firstName);
    });

    it('should pull from a passed in name', function() {
      var identify = new Identify({ traits: { name: name } });
      expect(identify.firstName()).to.eql(firstName);
    });

    it('should not fail on a non-string', function() {
      var identify = new Identify({
        traits: {
          firstName: {}
        }
      });
      expect(identify.firstName()).to.eql(undefined);
    });
  });

  describe('.lastName()', function() {
    var name = 'Freddie Mercury';
    var lastName = name.split(' ')[1];

    it('should pull from a passed in lastName', function() {
      var identify = new Identify({ traits: { lastName: lastName } });
      expect(identify.lastName()).to.eql(lastName);
    });

    it('should pull from a passed in name', function() {
      var identify = new Identify({ traits: { name: name } });
      expect(identify.lastName()).to.eql(lastName);
    });

    it('should split and trim the full lastName properly', function() {
      var identify = new Identify({ traits: { name: 'Freddie  Mercury III' } });
      expect(identify.lastName()).to.eql('Mercury III');
    });

    it('should not fail on a non-string', function() {
      var identify = new Identify({
        traits: {
          lastName: {}
        }
      });
      expect(identify.lastName()).to.eql(undefined);
    });
  });

  describe('.username()', function() {
    it('should pull from a passed in username', function() {
      var identify = new Identify({ traits: { username: 'calvinfo' } });
      expect(identify.username()).to.eql('calvinfo');
    });
  });

  describe('.uid()', function() {
    it('should pull the userId', function() {
      var identify = new Identify({ userId: 'id' });
      expect(identify.uid()).to.eql('id');
    });

    it('should pull the username', function() {
      var identify = new Identify({ traits: { username: 'username' } });
      expect(identify.uid()).to.eql('username');
    });

    it('should pull the email', function() {
      var identify = new Identify({ traits: { email: 'email@example.com' } });
      expect(identify.uid()).to.eql('email@example.com');
    });

    it('should prefer userId', function() {
      var identify = new Identify({
        userId: 'id',
        traits: {
          username: 'user',
          email: 'email'
        }
      });

      expect(identify.uid()).to.eql('id');
    });
  });

  describe('.gender()', function() {
    it('should return the gender', function() {
      var msg = new Identify({ traits: { gender: 'gender' } });
      expect(msg.gender()).to.eql('gender');
    });
  });

  describe('.birthday()', function() {
    it('should the birthday', function() {
      var msg = new Identify({ traits: { birthday: Date('2014-01-01') } });
      expect(msg.birthday()).to.eql(Date('2014-01-01'));
    });
  });

  describe('.age()', function() {
    it('should return the age', function() {
      var msg = new Identify({ traits: { age: 24 } });
      expect(msg.age()).to.eql(24);
    });

    it('should return null if .birthday() is not a date', function() {
      var msg = new Identify({ traits: { birthday: 1 } });
      expect(msg.age()).to.eql(undefined);
    });

    it('should compute the age from .birthday()', function() {
      var msg = new Identify({ traits: { birthday: new Date('2000-01-01') } });
      var date = msg.birthday().getFullYear();
      var now = new Date().getFullYear();
      expect(msg.age()).to.eql(now - date);
    });
  });

  describe('.website()', function() {
    it('should pull from a passed in website', function() {
      var identify = new Identify({ traits: { website: 'http://calv.info' } });
      expect(identify.website()).to.eql('http://calv.info');
    });

    it('should pull from .website[0] if .website is omitted', function() {
      var msg = new Identify({ traits: { websites: ['http://calv.info'] } });
      expect(msg.website()).to.eql('http://calv.info');
    });
  });

  describe('.websites()', function() {
    it('should pull from .websites', function() {
      var msg = new Identify({ traits: { websites: ['http://calv.info'] } });
      expect(msg.websites()).to.eql(['http://calv.info']);
    });

    it('should return [.website] if possible', function() {
      var msg = new Identify({ traits: { website: 'http://calv.info' } });
      expect(msg.websites()).to.eql(['http://calv.info']);
    });

    it('should return an empty array if .websites and .website are missing', function() {
      var msg = new Identify({});
      expect(msg.websites()).to.eql([]);
    });
  });

  describe('.description()', function() {
    it('should pull from description', function() {
      var identify = new Identify({ traits: { description: 'baz' } });
      expect(identify.description()).to.eql('baz');
    });

    it('should pull from background', function() {
      var identify = new Identify({ traits: { background: 'baz' } });
      expect(identify.description()).to.eql('baz');
    });

    it('should prefer description', function() {
      var identify = new Identify({ traits: {
        background: 'baz',
        description: 'foo'
      } });

      expect(identify.description()).to.eql('foo');
    });
  });

  describe('.phone()', function() {
    it('should pull from a passed in phone', function() {
      var identify = new Identify({ traits: { phone: '555-555-5555' } });
      expect(identify.phone()).to.eql('555-555-5555');
    });

    it('should pull from .phones[] when possible', function() {
      var msg = new Identify({ traits: { phones: ['555'] } });
      expect(msg.phone()).to.eql('555');
    });
  });

  describe('.phones()', function() {
    it('should pull from .phones', function() {
      var msg = new Identify({ traits: { phones: [1, 2] } });
      expect(msg.phones()).to.eql([1, 2]);
    });

    it('should fallback to [.phone]', function() {
      var msg = new Identify({ traits: { phone: 1 } });
      expect(msg.phones()).to.eql([1]);
    });
  });

  describe('.address()', function() {
    it('should pull from a passed in address', function() {
      var identify = new Identify({ traits: { address: '461 2nd St.' } });
      expect(identify.address()).to.eql('461 2nd St.');
    });
  });

  describe('.avatar()', function() {
    it('should pull from passed in avatar', function() {
      var identify = new Identify({ traits: { avatar: '//avatars/avatar.jpg' } });
      expect(identify.avatar()).to.eql('//avatars/avatar.jpg');
    });

    it('should fallback to .photoUrl', function() {
      var identify = new Identify({ traits: { photo_url: 'photo-url' } });
      expect(identify.avatar()).to.eql('photo-url');
    });

    it('should fallback to .avatarUrl', function() {
      var msg = new Identify({ traits: { avatarUrl: 'avatar-url' } });
      expect(msg.avatar()).to.eql('avatar-url');
    });
  });

  describe('.position()', function() {
    it('should proxy the position', function() {
      var identify = new Identify({ traits: { position: 'position' } });
      expect(identify.position()).to.eql('position');
    });

    it('should fallback to .jobTitle', function() {
      var identify = new Identify({ traits: { jobTitle: 'position' } });
      expect(identify.position()).to.eql('position');
    });
  });
});
