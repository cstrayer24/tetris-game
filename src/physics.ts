import { BLOCKH, BLOCKW } from "./constants.js";
import { Tetriminoe } from "./peices.js";

const isAtBottom = (ctx: CanvasRenderingContext2D, peice: Tetriminoe) =>
  !!peice.dumpBlocks().find((v) => v.y >= ctx.canvas.height - BLOCKH);
const isAtRightBarrier = (ctx: CanvasRenderingContext2D, peice: Tetriminoe) =>
  !!peice.dumpBlocks().find((v) => v.x >= ctx.canvas.width - BLOCKW);
const isAtLeftBarrier = (ctx: CanvasRenderingContext2D, peice: Tetriminoe) =>
  !!peice.dumpBlocks().find((v) => v.x <= BLOCKW / 2);
export { isAtBottom, isAtRightBarrier, isAtLeftBarrier };
