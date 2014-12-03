
var Facade = require('./');

var fixture = {
  traits: {
    websites:[
      'foo.com',
      'bar.com',
      'baz.biz'
    ],
    created: new Date(),
    date: '2014-01-01'
  }
};

suite('Facade - clone:true (default)', function () {
  var facade = new Facade(fixture);
  bench('new Facade()', function(){
    var facade = new Facade(fixture);
  });
  bench('.proxy', function(){
    facade.proxy('traits');
  });
  bench('.field', function(){
    facade.field('traits');
  });
});

suite('Facade - clone:false', function () {
  var opts = { clone: false };
  var facade = new Facade(fixture, opts);
  bench('new Facade()', function(){
    var facade = new Facade(fixture, opts);
  });
  bench('.proxy', function(){
    facade.proxy('traits');
  });
  bench('.field', function(){
    facade.field('traits');
  });
});

suite('Facade - clone:false, traverse:false', function () {
  var opts = { clone: false, traverse: false };
  var facade = new Facade(fixture, opts);
  bench('new Facade()', function(){
    var facade = new Facade(fixture, opts);
  });
  bench('.proxy', function(){
    facade.proxy('traits');
  });
  bench('.field', function(){
    facade.field('traits');
  });
});

