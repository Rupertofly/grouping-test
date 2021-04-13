import type Graph from './Graph';

export class Cell {
  get x() {
    return this._graph.posArray[this.i * 2];
  }
  get y() {
    return this._graph.posArray[this.i * 2 + 1];
  }
  get closeNode() {
    return this._graph.closestNode[this.i];
  }
  get distToNode() {
    return this._graph.DistToNode[this.i];
  }
  set closeNode(nodeIndex: number) {
    this._graph.closestNode[this.i] = nodeIndex;
  }
  set distToNode(dist: number) {
    this._graph.DistToNode[this.i] = dist;
  }
  get neighbours() {
    return this._graph.voronoi.neighbors(this.i);
  }
  group() {
    if (this.closeNode >= 0) {
      return this._graph.nodes[this.closeNode].group;
    } else return -1;
  }
  set(x: number, y: number) {
    this._graph.posArray.set([x, y], this.i * 2);
    if (!this.shouldRelax) {
      this.fx = x;
      this.fy = y;
    } else {
      this.fx = null;
      this.fy = null;
    }
  }
  fy?: number | null = null;
  fx?: number | null = null;

  readonly i: number;
  region: number = 0;
  shouldRelax = true;
  private _graph: Graph;
  constructor(
    i: number,
    gph: Graph,
    x: number = Math.random(),
    y: number = Math.random(),
  ) {
    this.i = i;
    this._graph = gph;
    this.set(x, y);
  }
}
