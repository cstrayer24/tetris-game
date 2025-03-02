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
      v.y === grid.length - 1 ||
      (grid[v.y + 1][v.x] !== undefined &&
        !peice.blks.includes(grid[v.y + 1][v.x]))
    ) {
      isTouching = true;
    }
  });
  return isTouching;
};

const hasPieceOnRight = (piece: Tetriminoe, grid: grid) => {
  let isTouching = false;
  piece.blks.forEach((blk) => {
    if (
      typeof grid[blk.y][blk.x + 1] !== "undefined" &&
      !piece.blks.includes(grid[blk.y][blk.x + 1])
    ) {
      isTouching = true;
      return;
    }
  });
  return isTouching;
};

const hasPieceOnLeft = (piece: Tetriminoe, grid: grid) => {
  let isTouching = false;
  piece.blks.forEach((blk) => {
    if (
      typeof grid[blk.y][blk.x - 1] !== "undefined" &&
      !piece.blks.includes(grid[blk.y][blk.x - 1])
    ) {
      isTouching = true;
      return;
    }
  });
  return isTouching;
};
function dropBlocks(grid: grid) {
  if (grid.every((row) => row.every((blk) => blk === undefined))) {
    return;
  }
  let topMostNonEmptyRow = grid.findIndex(
    (row) => !row.every((blk) => blk === undefined)
  );
  let bottomMostEmptyRow = grid.findLastIndex((row) =>
    row.every((blk) => blk === undefined)
  );
  let nonEmptyRow = topMostNonEmptyRow;
  const nonEmptyRows = [];
  let levelToMoveTo = -1;
  let state: 1 | 2 | 3 = 1;

  while (bottomMostEmptyRow > topMostNonEmptyRow) {
    switch (state) {
      case 1:
        if (grid[nonEmptyRow].every((blk) => blk === undefined)) {
          levelToMoveTo = nonEmptyRow;
          state = 2;
          continue;
        }
        nonEmptyRows.push(nonEmptyRow);
        nonEmptyRow++;
        break;
      case 2:
        if (
          levelToMoveTo === grid.length ||
          !grid[levelToMoveTo].every((blk) => blk === undefined)
        ) {
          levelToMoveTo--;
          state = 3;
          continue;
        }
        levelToMoveTo++;
        break;
      case 3:
        while (nonEmptyRows.length != 0) {
          const currRow = nonEmptyRows.pop();
          for (let i = 0; i < grid[currRow].length; i++) {
            if (grid[currRow][i] === undefined) {
              continue;
            }
            const currBlock = grid[currRow][i];
            grid[currBlock.y][currBlock.x] = undefined;
            currBlock.y = levelToMoveTo;
            grid[currBlock.y][currBlock.x] = currBlock;
          }
          levelToMoveTo--;
        }
        topMostNonEmptyRow = grid.findIndex(
          (row) => !row.every((blk) => blk === undefined)
        );
        bottomMostEmptyRow = grid.findLastIndex((row) =>
          row.every((blk) => blk === undefined)
        );
        nonEmptyRow = topMostNonEmptyRow;
        state = 1;
        break;
    }
  }
}

function dropPeice(peice: Tetriminoe, grid: grid) {
  const initalY = peice.y;
  while (!hasPieceBellow(peice, grid) && !isAtBottom(peice, grid)) {
    peice.y += 1;
  }
  return Math.max(peice.y - initalY, 1);
}

export {
  isAtBottom,
  isAtTop,
  isAtRightBarrier,
  isAtLeftBarrier,
  hasPieceBellow,
  hasPieceOnRight,
  hasPieceOnLeft,
  dropBlocks,
  dropPeice,
};
