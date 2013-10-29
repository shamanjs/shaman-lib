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

    it('should add the sub agents agents to the root', function(done) {
      var Agent = new shaman.Agent('main');
      var SubAgent = new shaman.Agent('sub');
      var SubAgent2 = new shaman.Agent('sub2');

      SubAgent.use(SubAgent2);
      Agent.use(SubAgent);

      Agent.agent('main').should.equal(Agent, 'root to root');
      Agent.agent('sub').should.equal(SubAgent, 'root to sub');
      Agent.agent('sub2').should.equal(SubAgent2, 'root to sub sub');

      SubAgent.agent('main').should.equal(Agent, 'sub to root');
      SubAgent.agent('sub').should.equal(SubAgent, 'sub to sub');
      SubAgent.agent('sub2').should.equal(SubAgent2, 'sub to sub sub');

      SubAgent2.agent('main').should.equal(Agent, 'sub sub to root');
      SubAgent2.agent('sub').should.equal(SubAgent, 'sub sub to sub');
      SubAgent2.agent('sub2').should.equal(SubAgent2, 'sub sub to sub sub');
      done();
    });


  });

});
