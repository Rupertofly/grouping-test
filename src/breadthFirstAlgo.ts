import type Graph from './Graph';

export function breadthFirstUpdate(graph: Graph) {
  graph.DistToNode.fill(99);
  graph.closestNode.fill(-1);
  for (let node of graph.nodes) {
    const ndI = node.i;
    const start = node.cell.i;
    let queue: number[] = [];
    queue.push(start);
    let visited: boolean[] = [];
    let distSearch: number[] = [];
    visited[start] = true;
    distSearch[start] = 0;
    while (queue.length > 0) {
      let currentI = queue.shift()!;
      if (distSearch[currentI] >= 8) continue;
      if (distSearch[currentI] < graph.cells[currentI].distToNode) {
        graph.cells[currentI].distToNode = distSearch[currentI];
        graph.cells[currentI].closeNode = ndI;
      }
      for (let nb of graph.cells[currentI].neighbours) {
        if (graph.cells[nb] && !visited[nb]) {
          visited[nb] = true;
          distSearch[nb] = distSearch[currentI] + 1;
          queue.push(nb);
        }
      }
    }
  }
}
