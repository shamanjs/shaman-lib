module.exports = function(graph, subGraph) {
  // copy its tree into ours
  Object.keys(subGraph.nodes).forEach(function(k){
    // add it to our graph
    graph.addNode(k);

    // copy the dependencies
    subGraph.dependenciesOf(k).forEach(function(dep){
      graph.addNode(dep);
      graph.addDependency(k, dep);
    });
  });
  return graph;
};