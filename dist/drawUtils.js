function drawBlock(block, ctx) {
    ctx.fillStyle = block.color;
    ctx.fillRect(block.x, block.y, block.w, block.h);
    ctx.fillStyle = "#00000";
}
const clearBehind = (ctx, block) => ctx.clearRect(block.x - block.w, block.y, block.w, block.h);
const clearAhead = (ctx, block) => ctx.clearRect(block.x + block.w, block.y, block.w, block.h);
const clearAbove = (ctx, block) => ctx.clearRect(block.x, block.y - block.h, block.w, block.h);
export { clearBehind, clearAhead, clearAbove, drawBlock };
