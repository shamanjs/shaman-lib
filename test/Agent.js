var shaman = require('../');
var should = require('should');
require('mocha');

describe('Agent', function() {
  it('should be exposed', function(done){
    should.exist(shaman.Agent);
    done();
  });

  it('should be an EventEmitter', function(done) {
    var Agent = new shaman.Agent('main');
    should.exist(Agent);
    should.exist(Agent.on);
    Agent.once('test', function(a){
      should.exist(a);
      a.should.equal(1);
      done();
    });
    Agent.emit('test', 1);
  });

  describe('start()', function() {
    it('should run asynchronously', function(done) {
      var Agent = new shaman.Agent('main');
      Agent.start(function(err){
        should.not.exist(err);
        done();
      });
    });
  });

  describe('stop()', function() {
    it('should run asynchronously', function(done) {
      var Agent = new shaman.Agent('main');
      Agent.stop(function(err){
        should.not.exist(err);
        done();
      });
    });
  });

  describe('use(agent)', function() {
    it('should make the sub agent root the main agent', function(done) {
      var Agent = new shaman.Agent('main');
      var SubAgent = new shaman.Agent('sub');
      Agent.use(SubAgent);

      Agent.root.should.equal(Agent);
      SubAgent.root.should.equal(Agent);

      done();
    });

    it('should add the sub agent to the graph', function(done) {
      var Agent = new shaman.Agent('main');
      var SubAgent = new shaman.Agent('sub');
      Agent.use(SubAgent);

      Agent.graph.overallOrder().should.eql(['sub', 'main']);
      done();
    });

    it('should add the sub agents graph to the graph', function(done) {
      var Agent = new shaman.Agent('main');
      var SubAgent = new shaman.Agent('sub');
      var SubAgent2 = new shaman.Agent('sub2');

      SubAgent.use(SubAgent2);
      Agent.use(SubAgent);

      Agent.graph.overallOrder().should.eql(['sub2', 'sub', 'main']);
      done();
    });

  });

});
