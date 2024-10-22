import { grid } from "./grid.js";
import { Tetriminoe } from "./peices.js";

const isAtBottom = (peice: Tetriminoe, grid: grid) =>
  peice.dumpBlocks().find((v) => v.y >= grid.length - 1);
const isAtRightBarrier = (peice: Tetriminoe, grid: grid) =>
  !!peice.dumpBlocks().find((v) => v.x >= grid[0].length - 1);

const isAtLeftBarrier = (peice: Tetriminoe, grid: grid) =>
  !!peice.dumpBlocks().find((v) => v.x <= 0);
const hasPieceBellow = (peice: Tetriminoe, grid: grid) => {
  let isTouching = false;
  const sortedBlocks = structuredClone(peice.dumpBlocks()).sort(
    (a, b) => a.y - b.y
  );
  const lowestBlocks = sortedBlocks.filter(
    (v) => sortedBlocks[sortedBlocks.length - 1].y <= v.y
  );
  lowestBlocks.forEach((v) => {
    if (typeof grid[v.y + 1][v.x] !== "undefined") {
      isTouching = true;
    }
  });
  return isTouching;
};

const hasPieceOnRight = (piece: Tetriminoe, grid: grid) => {
  let isTouching = false;
  const sortedBlocks = structuredClone(piece.dumpBlocks()).sort(
    (a, b) => a.x - b.x
  );
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
  const sortedBlocks = structuredClone(piece.dumpBlocks()).sort(
    (a, b) => a.x - b.x
  );
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
  isAtRightBarrier,
  isAtLeftBarrier,
  hasPieceBellow,
  hasPieceOnRight,
  hasPieceOnLeft,
};
