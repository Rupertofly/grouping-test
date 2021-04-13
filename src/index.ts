import { drawLoop, drawShape, spline } from '@rupertofly/h';
import { rgb } from 'd3-color';
import { fabric } from 'fabric';
import { breadthFirstUpdate } from './breadthFirstAlgo';
import { Controller } from './Controller';
import Graph from './Graph';
import * as vr from '@rupertofly/voronoi-regions';
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const { PI, random: rnd, floor: flr, ceil, abs, pow } = Math;
const TAU = PI * 2;
canvas.width = 720;
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
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, WID, HEI);
  if (graph.forceSim.alpha() > 0.1) graph.relax();
  graph.tickSim();
  breadthFirstUpdate(graph);
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
  let reg = vr.voronoiRegions(graph.voronoi, graph.cells, (cell) =>
    cell.group(),
  );
  ctx.lineWidth = 5;
  for (let rg of reg) {
    if (rg.region.type <= -1) continue;
    let cl = rgb(graph.types[rg.region.type]).brighter(0.5).toString();
    let strokecl = rgb(cl).brighter(0.5);
    ctx.fillStyle = cl;
    ctx.strokeStyle = strokecl.toString();
    ctx.beginPath();

    for (let loop of rg.shape) {
      drawLoop(
        spline(loop, Math.min(32, loop.length), true, loop.length * 4),
        true,
        ctx,
      );
    }
    // drawShape(rg.shape, ctx);
    ctx.fill();
    ctx.stroke();
  }
  // for (let pg of graph.voronoi.cellPolygons()) {
  //   let cellI = pg.index;
  //   let nd = graph.cells[cellI].closeNode;
  //   ctx.fillStyle = 'white';
  //   if (nd > -1) {
  //     ctx.fillStyle = rgb(graph.nodes[nd].scl).toString();
  //   }
  //   ctx.lineWidth = 1;
  //   ctx.strokeStyle = 'black';
  //   ctx.beginPath();
  //   drawLoop(pg as any, true, ctx);
  //   ctx.fill();
  // }
  for (let node of graph.nodes) {
    node.renderCtx(ctx);
  }

  frameCount++;
  window.requestAnimationFrame(draw);
}
window.requestAnimationFrame(draw);
