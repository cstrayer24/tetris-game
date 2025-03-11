import { BLOCKH, BLOCKW } from "./constants.js";
import { Block } from "./peices.js";

function drawBlock(block: Block, ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = block.color;
  ctx.fillRect(block.x * BLOCKW, block.y * BLOCKH, block.w, block.h);
  ctx.fillStyle = "#00000";
}

function drawGridLines(ctx: CanvasRenderingContext2D, grid: Block[][]) {
  ctx.strokeStyle = "grey";
  ctx.beginPath();
  for (let i = 0; i < grid[0].length; i++) {
    ctx.moveTo(i * BLOCKW, 0);
    ctx.lineTo(i * BLOCKW, ctx.canvas.height);
  }
  for (let i = 0; i < grid.length; i++) {
    ctx.moveTo(0, i * BLOCKH);
    ctx.lineTo(ctx.canvas.width, i * BLOCKH);
  }
  ctx.stroke();
  ctx.strokeStyle = "#00000";
}

const clrscrn = (ctx: CanvasRenderingContext2D) =>
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

export { drawBlock, drawGridLines, clrscrn };
