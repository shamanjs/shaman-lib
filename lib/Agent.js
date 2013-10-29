var DepGraph = require('dependency-graph').DepGraph;
var mergeAgent = require('./mergeAgent');

var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Agent(name) {
  if (!name) throw new Error("Agent needs a name");
  EventEmitter.call(this);
  this.name = name;
  this.root = this;
  this.agents = {};

  // construct initial graph
  this.graph = new DepGraph();
  this.graph.addNode(this.name);
  this.agents[this.name] = this;
}

util.inherits(Agent, EventEmitter);

Agent.prototype.agent = function(name) {
  return this.root.agents[name];
};

Agent.prototype.start = function(cb){
  // Listen for events on other Agents
  // read config etc
  cb();
};

Agent.prototype.stop = function(cb){
  // Remove listeners for events on other Agents
  // shut down servers etc.
  cb();
};

Agent.prototype.use = function(agent){
  // merge the graph into ours
  mergeAgent(this, agent);

  // attach the new graph tree to our main node
  this.graph.addDependency(this.name, agent.name);
  return this;
};

Agent.generators = {

};


module.exports = Agent;