import { fabric } from 'fabric';
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = 1280;
canvas.height = 720;
const { width: WID, height: HEI } = canvas;
const ctx = canvas.getContext('2d')!;
ctx.fillStyle = '#ff00ff';
ctx.fillRect(0, 0, WID, HEI);
const fab = new fabric.StaticCanvas(canvas);
const rc = new fabric.Rect({ width: 100, height: 100, fill: 'red' });
fab.add(rc);
fab.renderAll();
canvas.onmousemove = (e) => {
  let x = e.offsetX;
  let y = e.offsetY;
  rc.set({ left: x, top: y });
  fab.renderAll();
};
