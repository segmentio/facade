
var Facade = require('..')
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
      band : { meeting : { present : true }},
      dates: {
        start: '2014-01-01',
        end: '2014-02-01'
      }
    };

    var facade = new Facade(obj);

    it('should proxy a single field', function () {
      facade.members = Facade.field('members');
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

    it('should convert dates', function () {
      var dates = facade.proxy('dates');
      expect(dates.start).to.eql(new Date('2014-01-01'));
      expect(dates.end).to.eql(new Date('2014-02-01'));
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
      expect(facade.options('Salesforce')).to.be(undefined);
      expect(facade.options('Customer.io')).to.eql({});
    });

    it('should get options for a specifically enabled integration', function () {
      var options = { all : false, 'Customer.io' : true }
      var facade  = new Facade({ options : options });

      // sanity check.
      expect(facade.options('Customer.io')).to.eql({});
      expect(facade.options('HelpScout')).to.be(undefined);
      expect(facade.options('HubSpot')).to.be(undefined);

      // flat
      options = { all : false, 'Customer.io' : { setting : true }};
      facade = new Facade({ options : options });
      expect(facade.options('Customer.io')).to.eql({ setting : true });
      expect(facade.options('HelpScout')).to.be(undefined);

      // .integrations
      options = { HubSpot: { x: 1 } };
      facade = new Facade({ integrations: options });
      expect(facade.options('hub_spot')).to.eql({ x: 1 });

      // options.providers
      options = { providers: { HubSpot: { x: 1 } } };
      facade = new Facade({ options: options });
      expect(facade.options('hub_spot')).to.eql({ x: 1 });
    });

    it('should get options for a disabled by default integration that is enabled', function () {
      var options = { HubSpot : { setting : 'x' }}
        , facade  = new Facade({ options : options });

      expect(facade.options('HubSpot')).to.eql({ setting : 'x' });
      expect(facade.options('Customer.io')).to.eql({});
      expect(facade.options('Salesforce')).to.be(undefined);
    });

    it('should use obj-case', function(){
      var opts = { Intercom: { x: 'y' } };
      var facade = new Facade({ options: opts });
      expect(facade.options('intercom')).to.eql({ x: 'y' });
      expect(facade.options('Intercom')).to.eql({ x: 'y' });
    });
  });


  describe('.enabled()', function () {
    it('should be enabled by default', function () {
      var facade = new Facade({});
      expect(facade.enabled('Customer.io')).to.be(true);
    });

    it('should not be enabled if all == false', function () {
      var facade = new Facade({ options : { all : false }});
      expect(facade.enabled('Customer.io')).to.be(false);
    });

    it('should be able to override all == false', function () {
      var options = { all : false, 'Customer.io' : { x : 1 }}
        , facade = new Facade({ options : options });
      expect(facade.enabled('Customer.io')).to.be(true);
    });

    it('should override all == true', function () {
      var options = { all : true, 'Customer.io' : false }
        , facade = new Facade({ options : options });
      expect(facade.enabled('Customer.io')).to.be(false);
    });

    it('should use the providers.all', function () {
      var options = { providers : { all : false, 'Customer.io' : true }}
        , facade  = new Facade({ options : options });
      expect(facade.enabled('Customer.io')).to.be(true);
      expect(facade.enabled('Google Analytics')).to.be(false);
    });

    it('should only use disabled integrations when explicitly enabled', function () {
      var facade = new Facade({});
      expect(facade.enabled('Salesforce')).to.be(false);
      facade = new Facade({ options : { Salesforce : { x : 1 }}});
      expect(facade.enabled('Salesforce')).to.be(true);
    });

    it('should fall back to old providers api', function () {
      var providers = { 'Customer.io' : false, Salesforce : true }
        , facade = new Facade({ options : { providers : providers }});
      expect(facade.enabled('Customer.io')).to.be(false);
      expect(facade.enabled('Salesforce')).to.be(true);
    });
  });


  describe('.active()', function () {
    it('should be active by default', function () {
      var facade = new Facade({});
      expect(facade.active()).to.be(true);
    });

    it('should be active if enabled', function () {
      var facade = new Facade({ options : { active : true }});
      expect(facade.active()).to.be(true);
    });

    it('should not be active if disabled', function () {
      var facade = new Facade({ options : { active : false }});
      expect(facade.active()).to.be(false);
    });
  });


  describe('.channel()', function () {
    it('should return the channel', function () {
      var channel = 'english'
        , facade  = new Facade({ channel : channel });
      expect(facade.channel()).to.eql(channel);
    });
  });


  describe('.timestamp()', function () {
    it('should return the current timestamp if none is supplied', function () {
      var facade = new Facade({});
      expect(facade.timestamp()).to.not.be(undefined);
    });

    it('should return the specificed timestamp', function (done) {
      var timestamp = new Date();

      setTimeout(function () {
        var facade = new Facade({ timestamp : timestamp });
        expect(facade.timestamp()).to.eql(timestamp);
        expect(new Date()).not.to.eql(timestamp);
        done();
      }, 10);
    });

    it('should cast timestamps to dates', function () {
      var facade = new Facade({ timestamp: '5/12/2015' });
      expect(facade.timestamp()).to.eql(new Date('5/12/2015'));
    });
  });

  describe('.userAgent()', function(){
    it('should return the userAgent in options', function(){
      var facade = new Facade({ options: { userAgent: 'safari' } });
      expect(facade.userAgent()).to.eql('safari');
    })

    it('should return the userAgent in context', function(){
      var facade = new Facade({ context: { userAgent: 'safari' } });
      expect(facade.userAgent()).to.eql('safari');
    })
  })

  describe('.ip()', function () {
    it('should return the ip in options', function () {
      var ip     = '4.8.15.16'
        , facade = new Facade({ options : { ip : ip }});
      expect(facade.ip()).to.eql(ip);
    });

    it('should return the ip in context', function () {
      var ip     = '4.8.15.16'
        , facade = new Facade({ context : { ip : ip }});
      expect(facade.ip()).to.eql(ip);
    });
  });
});
