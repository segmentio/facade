
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

  describe('.companyCreated()', function(){
    var traits = { company: {} };

    it('should proxy from company.createdAt', function(){
      var date = traits.company.createdAt = new Date;
      var identify = new Identify({ traits: traits });
      expect(identify.companyCreated()).to.eql(date);
    })

    it('should proxy from company.created', function(){
      var date = traits.company.created = new Date;
      var identify = new Identify({ traits: traits });
      expect(identify.companyCreated()).to.eql(date);
    })

    it('should turn unix timestamps into dates', function(){
      traits.company.created = 1374193002;
      var identify = new Identify({ traits: traits });
      expect(identify.companyCreated()).to.eql(new Date(1374193002000));
    })

    it('should turn strings into dates', function(){
      var str = '2013-07-18T23:58:38.555Z';
      traits.company.created = str;
      var identify = new Identify({ traits: traits })
      expect(identify.companyCreated()).to.eql(new Date(str));
    })
  })


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

    it('should split and trim the full lastName properly', function () {
      var identify = new Identify({ traits: { name: 'Freddie  Mercury III' }});
      expect(identify.lastName()).to.eql('Mercury III');
    });
  });


  describe('.username()', function () {
    it('should pull from a passed in username', function () {
      var identify = new Identify({ traits : { username : 'calvinfo' }});
      expect(identify.username()).to.eql('calvinfo');
    });

    it('should pull from a passed in userId', function () {
      var identify = new Identify({ userId : 'calvinfo' });
      expect(identify.username()).to.eql('calvinfo');
    });

    it('should pull from a passed in sessionId', function () {
      var identify = new Identify({ sessionId : 'abc' });
      expect(identify.username()).to.eql('abc');
    });
  });


  describe('.website()', function () {
    it('should pull from a passed in website', function () {
      var identify = new Identify({ traits : { website : 'http://calv.info' }});
      expect(identify.website()).to.eql('http://calv.info');
    });
  });


  describe('.phone()', function () {
    it('should pull from a passed in phone', function () {
      var identify = new Identify({ traits : { phone : '555-555-5555' }});
      expect(identify.phone()).to.eql('555-555-5555');
    });
  });


  describe('.address()', function () {
    it('should pull from a passed in address', function () {
      var identify = new Identify({ traits : { address : '461 2nd St.' }});
      expect(identify.address()).to.eql('461 2nd St.');
    });
  });

  describe('.avatar()', function(){
    it('should pull from passed in avatar', function(){
      var identify = new Identify({ traits: { avatar: '//avatars/avatar.jpg' } });
      expect(identify.avatar()).to.eql('//avatars/avatar.jpg');
    })
  })
});
