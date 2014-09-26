
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

suite('Facade - clone:true', function () {
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
  var facade = new Facade(fixture, { clone: false });

  bench('new Facade()', function(){
    var facade = new Facade(fixture, { clone: false });
  });

  bench('.proxy', function(){
    facade.proxy('traits');
  });

  bench('.field', function(){
    facade.field('traits');
  });
});
