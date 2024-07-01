import { BLOCKH, BLOCKW } from "./constants.js";
const isAtBottom = (ctx, peice) => !!peice.dumpBlocks().find((v) => v.y >= ctx.canvas.height - BLOCKH);
const isAtRightBarrier = (ctx, peice) => !!peice.dumpBlocks().find((v) => v.x >= ctx.canvas.width - BLOCKW);
const isAtLeftBarrier = (ctx, peice) => !!peice.dumpBlocks().find((v) => v.x <= BLOCKW / 2);
export { isAtBottom, isAtRightBarrier, isAtLeftBarrier };
