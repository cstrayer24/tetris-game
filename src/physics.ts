import { grid } from "./grid.js";
import { Tetriminoe } from "./peices.js";
const isAtTop = (piece: Tetriminoe, grid: grid) =>
  !!piece.blks.find((v) => v.y <= 0);
const isAtBottom = (peice: Tetriminoe, grid: grid) =>
  !!peice.blks.find((v) => v.y >= grid.length - 1);
const isAtRightBarrier = (peice: Tetriminoe, grid: grid) =>
  !!peice.blks.find((v) => v.x >= grid[0].length - 1);

const isAtLeftBarrier = (peice: Tetriminoe, grid: grid) =>
  !!peice.blks.find((v) => v.x <= 0);
const hasPieceBellow = (peice: Tetriminoe, grid: grid) => {
  let isTouching = false;
  peice.blks.forEach((v) => {
    if (
      typeof grid[v.y + 1][v.x] !== "undefined" &&
      !peice.blks.includes(grid[v.y + 1][v.x])
    ) {
      isTouching = true;
    }
  });
  return isTouching;
};

const hasPieceOnRight = (piece: Tetriminoe, grid: grid) => {
  let isTouching = false;
  const sortedBlocks = structuredClone(piece.blks).sort((a, b) => a.x - b.x);
  const rightMostBlocks = sortedBlocks.filter(
    (v) => sortedBlocks[sortedBlocks.length - 1].x <= v.x
  );
  rightMostBlocks.forEach((v) => {
    if (typeof grid[v.y][v.x + 1] !== "undefined") {
      isTouching = true;
    }
  });
  return isTouching;
};

const hasPieceOnLeft = (piece: Tetriminoe, grid: grid) => {
  let isTouching = false;
  const sortedBlocks = structuredClone(piece.blks).sort((a, b) => a.x - b.x);
  const leftMostBlocks = sortedBlocks.filter((v) => sortedBlocks[0].x >= v.x);
  leftMostBlocks.forEach((v) => {
    if (typeof grid[v.y][v.x - 1] !== "undefined") {
      isTouching = true;
    }
  });
  return isTouching;
};
export {
  isAtBottom,
  isAtTop,
  isAtRightBarrier,
  isAtLeftBarrier,
  hasPieceBellow,
  hasPieceOnRight,
  hasPieceOnLeft,
};
