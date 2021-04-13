import type { Cell } from './Cell';
import * as d3 from 'd3';
import { NODE_RADIUS } from './Constants';
const { PI, random: rnd, floor: flr, ceil, abs, pow } = Math;
const TAU = PI * 2;
export class Node {
  readonly cell: Cell;
  vx: number = 0;
  vy: number = 0;
  isDragged = false;
  type = 'circle';
  cl = d3.interpolateRainbow(Math.random());
  scl = d3.rgb(this.cl).brighter().toString();
  i: number;
  group = 1;
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
  constructor(cell: Cell, i: number) {
    this.cell = cell;
    cell.region = 1;
    this.i = i;
  }
  renderCtx(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.cl;
    ctx.strokeStyle = this.scl;
    ctx.beginPath();
    ctx.arc(this.x, this.y, NODE_RADIUS, 0, TAU);
    ctx.closePath();
    ctx.fill();
    if (this.isDragged) ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.fillText(`${this.vx.toFixed(2)},${this.vy.toFixed(2)}`, this.x, this.y);
  }
}
export default Node;
