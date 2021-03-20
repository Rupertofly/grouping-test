import type Graph from './Graph';
import * as d3 from 'd3';
import Node from './Node';
import { randomLogistic } from 'd3';
export class Controller {
  model: Graph;
  constructor(model: Graph) {
    this.model = model;
    window.onkeypress = (e: KeyboardEvent) => {
      if (e.code == 'Space') {
        this.model.nodes.push(
          new Node(
            this.model.cells[
              Math.floor(Math.random() * this.model.cells.length)
            ],
            this.model.nodes.length,
          ),
        );
      }
    };
  }
  drag = (mdl: Graph) => {
    let offset = { x: 0, y: 0 };
    function dSubject(e: d3.D3DragEvent<HTMLCanvasElement, number, number>) {
      let subject = mdl.nearestNode(e.x, e.y, 30);
      console.log(`Selected: ${subject?.i}`);
      return subject?.i;
    }
    function dragstart(e: d3.D3DragEvent<HTMLCanvasElement, number, number>) {
      mdl.nodes[e.subject].cell.shouldRelax = false;
      let sbj = mdl.nodes[e.subject];
      offset.x = sbj.x - e.x;
      offset.y = sbj.y - e.y;
      sbj.isDragged = true;
    }
    function dragging(e: d3.D3DragEvent<HTMLCanvasElement, number, number>) {
      mdl.nodes[e.subject].cell.set(e.x + offset.x, e.y + offset.y);
    }
    function draggend(e: d3.D3DragEvent<HTMLCanvasElement, number, number>) {
      mdl.nodes[e.subject].cell.shouldRelax = true;
      mdl.nodes[e.subject].isDragged = false;
    }
    return d3
      .drag()
      .subject(dSubject)
      .on('start', dragstart)
      .on('drag', dragging)
      .on('end', draggend);
  };
  bindDrag(elem: HTMLElement) {
    d3.select(elem as any).call(this.drag(this.model));
  }
}
