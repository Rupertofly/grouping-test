import * as d3 from 'd3';
import type { Delaunay, Voronoi } from 'd3';
import { Cell } from './Cell';
import { Node } from './Node';
import { NUM_POINTS } from './Constants';
type Pt = [number, number];
type Lp = Pt[];
export class Graph {
  posArray: Float32Array = new Float32Array(NUM_POINTS * 2);
  cells: Cell[] = [];
  nodes: Node[] = [];
  delaunay: Delaunay<number>;
  voronoi: Voronoi<number>;
  width: number;
  height: number;
  constructor(wid: number, hei: number) {
    this.width = wid;
    this.height = hei;
    for (let i = 0; i < NUM_POINTS; i++) {
      this.cells[i] = new Cell(
        i,
        this,
        Math.random() * wid,
        Math.random() * hei,
      );
    }
    this.delaunay = new d3.Delaunay(this.posArray);
    this.voronoi = this.delaunay.voronoi([0, 0, this.width, this.height]);
    this.nodes.push(new Node(this.cells[1], this.nodes.length));
    this.nodes.push(new Node(this.cells[3], this.nodes.length));
  }
  nearestNode(x: number, y: number, r: number = Infinity) {
    let qt = d3
      .quadtree<Node>()
      .x((d) => d.x)
      .y((d) => d.y)
      .addAll(this.nodes);
    return qt.find(x, y, r);
  }
  nearestCell(x: number, y: number, r?: number) {
    let index = this.delaunay.find(x, y);
    let cl = this.cells[index];
    if (r != undefined) {
      let dist = Math.abs(Math.sqrt((cl.x - x) ** 2 + (cl.y - y) ** 2));
      if (dist > r) return undefined;
    }
    return cl;
  }
  updateDelaunay() {
    this.delaunay = new d3.Delaunay(this.posArray);
  }
  updateVoronoi() {
    this.voronoi = this.delaunay.voronoi([0, 0, this.width, this.height]);
  }
  relax() {
    this.updateDelaunay();
    this.updateVoronoi();
    for (let polygon of this.voronoi.cellPolygons()) {
      let cell = this.cells[polygon.index];
      if (!cell.shouldRelax) continue;

      let [cx, cy] = d3.polygonCentroid(polygon as any);
      cell.set(cx, cy);
    }
  }
}
export default Graph;
