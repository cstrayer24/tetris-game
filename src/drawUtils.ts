import { Block } from "./peices.js";

function drawBlock(block: Block, ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = block.color;
  ctx.fillRect(block.x, block.y, block.w, block.h);
  ctx.fillStyle = "#00000";
}
const clearBehind = (ctx: CanvasRenderingContext2D, block: Block) =>
  ctx.clearRect(block.x - block.w, block.y, block.w, block.h);
const clearAhead = (ctx: CanvasRenderingContext2D, block: Block) =>
  ctx.clearRect(block.x + block.w, block.y, block.w, block.h);
const clearAbove = (ctx: CanvasRenderingContext2D, block: Block) =>
  ctx.clearRect(block.x, block.y - block.h, block.w, block.h);

export { clearBehind, clearAhead, clearAbove, drawBlock };
