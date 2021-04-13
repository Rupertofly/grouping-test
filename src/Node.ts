import type { Cell } from './Cell';
import * as d3 from 'd3';
import { NODE_RADIUS } from './Constants';
const { PI, random: rnd, floor: flr, ceil, abs, pow } = Math;
const TAU = PI * 2;
let i = 0;
let regions: string[] = [];
export class Node {
  readonly cell: Cell;
  vx: number = 0;
  vy: number = 0;
  isDragged = false;
  type = 'circle';
  get cl() {
    return regions[this.group];
  }
  scl = d3.rgb(this.cl).brighter(0.7).toString();
  i: number;

  group: number;
  get x() {
    return this.cell.x;
  }
  set x(x: number) {
    this.cell.set(x, this.cell.y);
    // if (this.vx > 0.1) console.log(this.vx);
  }
  get y() {
    return this.cell.y;
  }
  set y(y: number) {
    this.cell.set(this.cell.x, y);
  }
  get fx() {
    return this.cell.fx;
  }
  get fy() {
    return this.cell.fy;
  }
  constructor(cell: Cell, i: number, regs: string[]) {
    this.cell = cell;
    cell.region = i;
    this.group = i % 6;
    regions = regs;
    this.i = i;
  }
  renderCtx(ctx: CanvasRenderingContext2D) {
    this.scl = d3.rgb(this.cl).brighter(0.7).toString();
    ctx.fillStyle = this.cl;
    ctx.strokeStyle = this.scl;
    ctx.beginPath();
    ctx.arc(this.x, this.y, NODE_RADIUS, 0, TAU);
    ctx.closePath();
    ctx.fill();
    if (this.isDragged) ctx.stroke();
  }
}
export default Node;
