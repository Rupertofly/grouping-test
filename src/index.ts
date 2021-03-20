import { drawLoop } from '@rupertofly/h';
import { fabric } from 'fabric';
import { Controller } from './Controller';
import Graph from './Graph';
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const { PI, random: rnd, floor: flr, ceil, abs, pow } = Math;
const TAU = PI * 2;
canvas.width = 1280;
canvas.height = 720;
let frameCount = 0;
const { width: WID, height: HEI } = canvas;
const ctx = canvas.getContext('2d')!;
ctx.clearRect(0, 0, WID, HEI);
ctx.fillStyle = 'black';
ctx.lineWidth = 5;
const graph = new Graph(WID, HEI);
const ctrl = new Controller(graph);
ctrl.bindDrag(canvas);
function draw() {
  ctx.clearRect(0, 0, WID, HEI);
  graph.relax();
  ctx.fillStyle = 'black';

  // for (let cell of graph.cells) {
  //   ctx.beginPath();
  //   ctx.ellipse(cell.x, cell.y, 2, 2, 0, 0, TAU);
  //   ctx.closePath();
  //   ctx.fill();
  // }
  // for (let pg of graph.voronoi.cellPolygons()) {
  //   ctx.beginPath();
  //   drawLoop(pg as any, true, ctx);
  //   ctx.stroke();
  // }
  for (let node of graph.nodes) {
    node.renderCtx(ctx);
  }
  frameCount++;
  window.requestAnimationFrame(draw);
}
window.requestAnimationFrame(draw);
