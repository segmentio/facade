var Facade = require('../lib');
var expect = require('expect.js');

describe('Facade', function (){
  describe('.proxy()', function (){
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

    it('should proxy a single field', function(){
      facade.members = Facade.field('members');
      expect(facade.members()).to.eql(obj.members);
      expect(facade.proxy('members')).to.eql(facade.members());
    });

    it('should proxy a nested field', function(){
      facade.brett = Facade.proxy('members.Brett');
      expect(facade.brett()).to.eql(obj.members.Brett);
      expect(facade.brett()).to.eql(facade.proxy('members.Brett'));
    });

    it('should proxy a multiple-nested field', function(){
      facade.present = Facade.proxy('band.meeting.present');
      expect(facade.present()).to.eql(obj.band.meeting.present);
      expect(facade.present()).to.eql(facade.proxy('band.meeting.present'));
    });

    it('should proxy a method as the first field', function(){
      facade.virtual = function(){ return { result : true }; };
      expect(facade.proxy('virtual.result')).to.eql(true);
      facade.test = Facade.proxy('virtual.result');
      expect(facade.test()).to.eql(true);
    });

    it('should convert dates', function(){
      var dates = facade.proxy('dates');
      expect(dates.start).to.eql(new Date('2014-01-01'));
      expect(dates.end).to.eql(new Date('2014-02-01'));
    });
  });

  describe('.json()', function(){
    it('should return the full object', function(){
      var obj = { a: 'b', c: 'd', x: [1,2,3] };
      var facade = new Facade(obj);
      expect(facade.json()).to.eql(obj);
    });

    it('should add .type', function(){
      var track = new Facade.Track({});
      expect(track.json().type).to.eql('track');
    });
  });

  describe('.context()', function(){
    it('should pull from "context" for backwards compatibility', function(){
      var options = { a : 'b' };
      var facade = new Facade({ options : options });
      expect(facade.context()).to.eql(options);
      expect(facade.options()).to.eql(options);
    });

    it('should pull from "context"', function(){
      var context = { a : 'b' };
      var facade = new Facade({ context : context });
      expect(facade.context()).to.eql(context);
    });

    it('should not get context when all integrations are disabled', function(){
      var context = { all : false };
      var facade = new Facade({ context : context });
      expect(facade.context('Customer.io')).to.be(undefined);
    });

    it('should not get context for disabled by default integrations', function(){
      var facade = new Facade({});
      expect(facade.context('Salesforce')).to.be(undefined);
      expect(facade.context('Customer.io')).to.eql({});
    });

    it('should get context for a specifically enabled integration', function(){
      var context = { all : false, 'Customer.io' : true };
      var facade = new Facade({ context : context });

      // sanity check.
      expect(facade.context('Customer.io')).to.eql({});
      expect(facade.context('HelpScout')).to.be(undefined);
      expect(facade.context('HubSpot')).to.be(undefined);

      // flat
      context = { all : false, 'Customer.io' : { setting : true }};
      facade = new Facade({ context : context });
      expect(facade.context('Customer.io')).to.eql({ setting : true });
      expect(facade.context('HelpScout')).to.be(undefined);

      // .integrations
      context = { HubSpot: { x: 1 } };
      facade = new Facade({ integrations: context });
      expect(facade.context('hub_spot')).to.eql({ x: 1 });

      // context.providers
      context = { providers: { HubSpot: { x: 1 } } };
      facade = new Facade({ context: context });
      expect(facade.context('hub_spot')).to.eql({ x: 1 });
    });

    it('should get context for a disabled by default integration that is enabled', function(){
      var context = { HubSpot : { setting : 'x' }};
      var facade = new Facade({ context : context });

      expect(facade.context('HubSpot')).to.eql({ setting : 'x' });
      expect(facade.context('Customer.io')).to.eql({});
      expect(facade.context('Salesforce')).to.be(undefined);
    });

    it('should use obj-case', function(){
      var opts = { Intercom: { x: 'y' } };
      var facade = new Facade({ context: opts });
      expect(facade.context('intercom')).to.eql({ x: 'y' });
      expect(facade.context('Intercom')).to.eql({ x: 'y' });
    });
  });

  describe('.enabled()', function(){
    it('should be enabled by default', function(){
      var facade = new Facade({});
      expect(facade.enabled('Customer.io')).to.be(true);
    });

    it('should not be enabled if all == false', function(){
      var facade = new Facade({ context : { all : false }});
      expect(facade.enabled('Customer.io')).to.be(false);
    });

    it('should be able to override all == false', function(){
      var context = { all : false, 'Customer.io' : { x : 1 }};
      var facade = new Facade({ context : context });
      expect(facade.enabled('Customer.io')).to.be(true);
    });

    it('should override all == true', function(){
      var context = { all : true, 'Customer.io' : false };
      var facade = new Facade({ context : context });
      expect(facade.enabled('Customer.io')).to.be(false);
    });

    it('should use the providers.all', function(){
      var context = { providers : { all : false, 'Customer.io' : true }};
      var facade  = new Facade({ context : context });
      expect(facade.enabled('Customer.io')).to.be(true);
      expect(facade.enabled('Google Analytics')).to.be(false);
    });

    it('should only use disabled integrations when explicitly enabled', function(){
      var facade = new Facade({});
      expect(facade.enabled('Salesforce')).to.be(false);
      facade = new Facade({ context : { Salesforce : { x : 1 }}});
      expect(facade.enabled('Salesforce')).to.be(true);
    });

    it('should fall back to old providers api', function(){
      var providers = { 'Customer.io' : false, Salesforce : true };
      var facade = new Facade({ context : { providers : providers }});
      expect(facade.enabled('Customer.io')).to.be(false);
      expect(facade.enabled('Salesforce')).to.be(true);
    });

    it('should pull from .integrations', function(){
      var integrations = { 'Customer.io': false, Salesforce: true };
      var facade = new Facade({ integrations: integrations });
      expect(facade.enabled('Customer.io')).to.be(false);
      expect(facade.enabled('Salesforce')).to.be(true);
    });

    it('should pull from .integrations.all', function(){
      var facade = new Facade({ integrations: { all: false }});
      expect(facade.enabled('Customer.io')).to.be(false);
    });
  });

  describe('.active()', function(){
    it('should be active by default', function(){
      var facade = new Facade({});
      expect(facade.active()).to.be(true);
    });

    it('should be active if enabled', function(){
      var facade = new Facade({ context : { active : true }});
      expect(facade.active()).to.be(true);
    });

    it('should not be active if disabled', function(){
      var facade = new Facade({ context : { active : false }});
      expect(facade.active()).to.be(false);
    });
  });

  describe('.groupId()', function(){
    it('should proxy the groupId', function(){
      var groupId = 'groupId';
      var facade = new Facade({ context: { groupId: groupId } });
      expect(facade.groupId()).to.eql(groupId);
    });
  });

  describe('.traits()', function(){
    it('should proxy the traits', function(){
      var traits = { someVal: 1 };
      var facade = new Facade({ context: { traits: traits }});
      expect(facade.traits()).to.eql(traits);
    });

    it('should return an empty object with no traits', function(){
      var facade = new Facade({});
      expect(facade.traits()).to.eql({});
    });

    it('should mixin id if available', function(){
      var id = 123;
      var facade = new Facade({ userId: id });
      expect(facade.traits()).to.eql({ id: id });
    });

    it('should respect aliases', function(){
      var facade = new Facade({ context: { traits: { a: 'b', c: 'c', email: 'a@b.com' } }});
      expect(facade.traits({ a: 'b', email: '$email' })).to.eql({
        $email: 'a@b.com',
        b: 'b',
        c: 'c'
      });
    });
  });

  describe('.channel()', function(){
    it('should return the channel', function(){
      var channel = 'english';
      var facade  = new Facade({ channel : channel });
      expect(facade.channel()).to.eql(channel);
    });
  });

  describe('.timestamp()', function(){
    it('should return the current timestamp if none is supplied', function(){
      var facade = new Facade({});
      expect(facade.timestamp()).to.not.be(undefined);
    });

    it('should return the specificed timestamp', function (done) {
      var timestamp = new Date();
      setTimeout(function(){
        var facade = new Facade({ timestamp : timestamp });
        expect(facade.timestamp()).to.eql(timestamp);
        expect(new Date()).not.to.eql(timestamp);
        done();
      }, 10);
    });

    it('should cast timestamps to dates', function(){
      var facade = new Facade({ timestamp: '5/12/2015' });
      expect(facade.timestamp()).to.eql(new Date('5/12/2015'));
    });
  });

  describe('.userAgent()', function(){
    it('should return the userAgent in context', function(){
      var facade = new Facade({ context: { userAgent: 'safari' } });
      expect(facade.userAgent()).to.eql('safari');
    })

    it('should return the userAgent in context', function(){
      var facade = new Facade({ context: { userAgent: 'safari' } });
      expect(facade.userAgent()).to.eql('safari');
    })
  })

  describe('.ip()', function(){
    it('should return the ip in context', function(){
      var ip = '4.8.15.16';
      var facade = new Facade({ context : { ip : ip }});
      expect(facade.ip()).to.eql(ip);
    });

    it('should return the ip in context', function(){
      var ip = '4.8.15.16';
      var facade = new Facade({ context : { ip : ip }});
      expect(facade.ip()).to.eql(ip);
    });
  });

  describe('.library()', function(){
    it('should return unknown if library is not present', function(){
      expect(new Facade({}).library()).to.eql({
        name: 'unknown',
        version: null
      });
    });

    it('should detect a library that is a string', function(){
      expect(new Facade({
        options: { library: 'analytics-node' }
      }).library()).to.eql({
        name: 'analytics-node',
        version: null
      });
    });

    it('should detect a library that is an object', function(){
      expect(new Facade({
        options: { library: { name: 'analytics-node', version: 1.0 }}
      }).library()).to.eql({
        name: 'analytics-node',
        version: 1.0
      });
    });
  });
});
