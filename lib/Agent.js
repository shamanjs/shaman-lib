var DepGraph = require('dependency-graph').DepGraph;
var mergeGraph = require('./mergeGraph');

var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Agent(name) {
  if (!name) throw new Error("Agent needs a name");
  EventEmitter.call(this);
  this.name = name;
  this.root = this;

  this.graph = new DepGraph();
  this.graph.addNode(this.name);

  this.agents = {};
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
  // set root to us
  // because it is now sub-task
  agent.root = this;

  // add agent to the graph
  this.root.agents[agent.name] = agent;

  // merge the graph into ours
  mergeGraph(this.graph, agent.graph);

  // attach the new graph tree to our main node
  this.graph.addDependency(this.name, agent.name);
  return this;
};

Agent.generators = {

};


module.exports = Agent;