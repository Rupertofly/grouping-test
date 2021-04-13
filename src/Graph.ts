import * as d3 from 'd3';
import {
  Delaunay,
  forceManyBody,
  ForceManyBody,
  forceSimulation,
  interpolateRainbow,
  range,
  Simulation,
  Voronoi,
} from 'd3';
import { Cell } from './Cell';
import { Node } from './Node';
import { NUM_POINTS } from './Constants';
type Pt = [number, number];
type Lp = Pt[];
export class Graph {
  posArray: Float32Array = new Float32Array(NUM_POINTS * 2);
  closestNode: Int16Array = new Int16Array(NUM_POINTS).fill(-1);
  DistToNode: Int16Array = new Int16Array(NUM_POINTS).fill(256);
  cells: Cell[] = [];
  nodes: Node[] = [];
  types: string[] = [];
  delaunay: Delaunay<number>;
  voronoi: Voronoi<number>;
  forceSim: Simulation<Node, undefined>;
  force: ForceManyBody<Node>;
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
    for (let i of range(6)) {
      this.types[i] = interpolateRainbow(i * (1 / 6));
    }
    this.delaunay = new d3.Delaunay(this.posArray);
    this.voronoi = this.delaunay.voronoi([0, 0, this.width, this.height]);
    this.nodes.push(new Node(this.cells[1], this.nodes.length, this.types));
    this.nodes.push(new Node(this.cells[3], this.nodes.length, this.types));

    this.forceSim = forceSimulation(this.nodes);
    this.force = forceManyBody<Node>()
      .strength(-100)
      .distanceMax(this.width / 4);
    this.forceSim.force('sepperate', this.force);

    this.forceSim.stop();
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
    this.delaunay.update();
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
  tickSim() {
    this.forceSim.tick();
  }
}
export default Graph;
