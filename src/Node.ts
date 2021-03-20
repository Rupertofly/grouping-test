import type { Cell } from './Cell';
import * as d3 from 'd3';
import { NODE_RADIUS } from './Constants';
const { PI, random: rnd, floor: flr, ceil, abs, pow } = Math;
const TAU = PI * 2;
export class Node {
  readonly cell: Cell;
  isDragged = false;
  type = 'circle';
  cl = d3.interpolateRainbow(Math.random());
  scl = d3.rgb(this.cl).brighter().toString();
  i: number;
  group = 1;
  get x() {
    return this.cell.x;
  }
  get y() {
    return this.cell.y;
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
  }
}
export default Node;
