module.exports = function(agent, subAgent) {
  // copy its tree into ours
  Object.keys(subAgent.graph.nodes).forEach(function(k){
    // add it to our graph
    if (!agent.graph.hasNode(k)) {
      agent.graph.addNode(k);
      agent.root.agents[k] = subAgent.agents[k];
      subAgent.agents[k].root = agent.root;
    }

    // copy the dependencies
    subAgent.graph.dependenciesOf(k).forEach(function(dep){
      if (!agent.graph.hasNode(dep)) {
        agent.graph.addNode(dep);
        agent.root.agents[dep] = subAgent.agents[dep];
        subAgent.agents[dep].root = agent.root;
      }
      agent.graph.addDependency(k, dep);
    });
  });
  return agent;
};