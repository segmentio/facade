
var Facade = require('../lib/Facade')
  , expect = require('expect.js');


describe('Facade', function () {

  describe('.proxy()', function () {

    var obj = {
      name : 'Flight of the Conchords',
      members : {
        'Brett'   : 'Likes animals',
        'Jemaine' : 'Rock and roll',
        'Murray'  : 'Band manager'
      },
      band : { meeting : { present : true }}
    };

    var facade = new Facade(obj);

    it('should proxy a single field', function () {
      facade.members = Facade.proxy('members');
      expect(facade.members()).to.eql(obj.members);
      expect(facade.proxy('members')).to.eql(facade.members());
    });

    it('should proxy a nested field', function () {
      facade.brett = Facade.proxy('members.Brett');
      expect(facade.brett()).to.eql(obj.members.Brett);
      expect(facade.brett()).to.eql(facade.proxy('members.Brett'));
    });

    it('should proxy a multiple-nested field', function () {
      facade.present = Facade.proxy('band.meeting.present');
      expect(facade.present()).to.eql(obj.band.meeting.present);
      expect(facade.present()).to.eql(facade.proxy('band.meeting.present'));
    });

    it('should proxy a method as the first field', function () {
      facade.virtual = function () { return { result : true }; };
      expect(facade.proxy('virtual.result')).to.eql(true);
      facade.test = Facade.proxy('virtual.result');
      expect(facade.test()).to.eql(true);
    });
  });


  describe('.json()', function () {
    it('should return the full object', function () {
      var obj    = { a : 'b', c : 'd', x : [1,2,3] }
        , facade = new Facade(obj);

      expect(facade.json()).to.eql(obj);
    });
  });


  describe('.options()', function () {
    it('should pull from "context" for backwards compatibility', function () {
      var context = { a : 'b' }
        , facade  = new Facade({ context : context });

      expect(facade.options()).to.eql(context);
    });

    it('should pull from "options"', function () {
      var options = { a : 'b' }
        , facade  = new Facade({ options : options });

      expect(facade.options()).to.eql(options);
    });

    it('should not get options when all integrations are disabled', function () {
      var options = { all : false }
        , facade  = new Facade({ options : options });
      expect(facade.options('Customer.io')).to.be(undefined);
    });

    it('should not get options for disabled by default integrations', function () {
      var facade = new Facade({});
      expect(facade.options('HubSpot')).to.be(undefined);
      expect(facade.options('Customer.io')).to.eql({});
    });

    it('should get options for a specifically enabled integration', function () {
      var options = { all : false, 'Customer.io' : true }
        , facade  = new Facade({ options : options });
      expect(facade.options('Customer.io')).to.eql({});
      expect(facade.options('HelpScout')).to.be(undefined);
      expect(facade.options('HubSpot')).to.be(undefined);

      options = { all : false, 'Customer.io' : { setting : true }};
      facade = new Facade({ options : options });

      expect(facade.options('Customer.io')).to.eql({ setting : true });
      expect(facade.options('HelpScout')).to.be(undefined);
    });

    it('should get options for a disabled by default integration that is enabled', function () {
      var options = { HubSpot : { setting : 'x' }}
        , facade  = new Facade({ options : options });

      expect(facade.options('HubSpot')).to.eql({ setting : 'x' });
      expect(facade.options('Customer.io')).to.eql({});
      expect(facade.options('Salesforce')).to.be(undefined);
    });
  });


  describe('.enabled()', function () {
  });


  describe('.userAgent()', function () {
  });

  describe('.channel()', function () {
  });


  describe('.timestamp()', function () {
  });


  describe('.ip()', function () {
  });
});