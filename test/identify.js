
var Identify = require('../').Identify
  , expect   = require('expect.js');

describe('Identify', function () {

  var obj = {
    userId    : '123',
    sessionId : '4.8.15.16.23.42'
  };

  var identify = new Identify(obj);


  describe('.action()', function () {
    it('should have the right action', function () {
      expect(identify.action()).to.be('identify');
    });
  });


  describe('.userId()', function () {
    it('should proxy the userId', function () {
      expect(identify.userId()).to.eql(obj.userId);
    });
  });


  describe('.sessionId()', function () {
    it('should proxy the sessionId', function () {
      expect(identify.sessionId()).to.eql(obj.sessionId);
    });
  });


  describe('.traits()', function () {
    it('should proxy the traits', function () {
      var traits   = { a : 'b', c : [1,2,3] }
        , identify = new Identify({ traits : traits });
      expect(identify.traits()).to.eql(traits);
    });

    it('should return an empty object if no traits are given', function () {
      var identify = new Identify(obj);
      expect(identify.traits()).to.eql({});
    });
  });


  describe('.email()', function () {
    var email = 'calvin@segment.io';
    it('should proxy the email from traits', function () {
      var identify = new Identify({ userId : 'x', traits : { email : email }});
      expect(identify.email()).to.eql(email);
    });

    it('should proxy the email from userId', function () {
      var identify = new Identify({ userId : email });
      expect(identify.email()).to.eql(email);
    });
  });


  describe('.created()', function () {
    var created = new Date();

    it('should proxy from createdAt', function () {
      var identify = new Identify({ traits : { createdAt : created }});
      expect(identify.created()).to.eql(created);
    });

    it('should proxy from created', function () {
      var identify = new Identify({ traits : { created : created }});
      expect(identify.created()).to.eql(created);
    });

    it('should turn unix timestamps into dates', function () {
      var identify = new Identify({ traits : { created : 1374193002 }});
      expect(identify.created()).to.eql(new Date(1374193002000));
    });

    it('should turn strings into dates', function () {
      var identify = new Identify({
        traits : {
          created : '2013-07-18T23:58:38.555Z'
        }
      });
      expect(identify.created()).to.eql(new Date('2013-07-18T23:58:38.555Z'));
    });
  });


  describe('.name()', function () {
    var name      = 'Freddie Mercury'
      , firstName = name.split(' ')[0]
      , lastName  = name.split(' ')[1];

    it('should pull name from a passed in name', function () {
      var identify = new Identify({ traits : { name : name }});
      expect(identify.name()).to.eql(name);
    });

    it('should pull name from a firstName/lastName pair', function () {
      var identify  = new Identify({
        traits : {
          firstName : firstName,
          lastName  : lastName
        }
      });
      expect(identify.name()).to.eql(firstName + ' ' + lastName);
    });
  });


  describe('.firstName()', function () {
    var name      = 'Freddie Mercury'
      , firstName = name.split(' ')[0]
      , lastName  = name.split(' ')[1];

    it('should pull from a passed in firstName', function () {
      debugger;
      var identify = new Identify({ traits : { firstName : firstName }});
      expect(identify.firstName()).to.eql(firstName);
    });

    it('should pull from a passed in name', function () {
      var identify = new Identify({ traits : { name : name }});
      expect(identify.firstName()).to.eql(firstName);
    });
  });


  describe('.lastName()', function () {
    var name      = 'Freddie Mercury'
      , firstName = name.split(' ')[0]
      , lastName  = name.split(' ')[1];

    it('should pull from a passed in lastName', function () {
      var identify = new Identify({ traits : { lastName : lastName }});
      expect(identify.lastName()).to.eql(lastName);
    });

    it('should pull from a passed in name', function () {
      var identify = new Identify({ traits : { name : name }});
      expect(identify.lastName()).to.eql(lastName);
    });
  });


  describe('.website()', function () {
  });


  describe('.phone()', function () {
  });


  describe('.address()', function () {
  });
});