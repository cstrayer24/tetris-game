import { BLOCKH, BLOCKW } from "./constants.js";
import { Block, Tetriminoe } from "./peices.js";

type grid = Block[][];
function createGrid(w: number, h: number): grid {
  return Array.from({ length: h }, () => new Array(w).fill(undefined));
}
function updateGrid(grid: grid, peice: Tetriminoe, isInternalGrid?: boolean) {
  const blks = peice.blks;
  const xKey = isInternalGrid ? "ix" : "x";
  const yKey = isInternalGrid ? "iy" : "y";
  blks.forEach((blk) => {
    //this might be unnecessary
    if (
      blk[yKey] > grid.length - 1 ||
      grid[yKey] < 0 ||
      blk[xKey] > grid[blk[yKey]].length - 1
    ) {
      return;
    }
    grid[blk[yKey]][blk[xKey]] = blk;
  });
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (typeof grid[i][j] === "undefined") {
        continue;
      }
      if (grid[i][j][xKey] !== j || grid[i][j][yKey] !== i) {
        grid[i][j] = undefined;
      }
    }
  }
}

function clearGrid(grid: grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j] = undefined;
    }
  }
}
function setBlockPosToInternalGridPos(Igrid: grid) {
  for (let i = 0; i < Igrid.length; i++) {
    for (let j = 0; j < Igrid[i].length; j++) {
      if (typeof Igrid[i][j] === "undefined") {
        continue;
      }
      Igrid[i][j].iy = i;
      Igrid[i][j].ix = j;
    }
  }
}
function scaleInternalToGameboardGrid(Igrid: grid, BaseBlock: Block) {
  for (let i = 0; i < Igrid.length; i++) {
    for (let j = 0; j < Igrid[i].length; j++) {
      if (typeof Igrid[i][j] === "undefined") {
        continue;
      }
      Igrid[i][j].x = BaseBlock.x;
      Igrid[i][j].y = BaseBlock.y;
      Igrid[i][j].y += Igrid[i][j].iy - BaseBlock.iy;
      Igrid[i][j].x += Igrid[i][j].ix - BaseBlock.ix;
    }
  }
}

function rotateGrid(grid: grid) {
  const reversedGrid = [];
  for (let i = 0; i < grid.length; i++) {
    const newRow = [];
    for (let j = grid.length - 1; j > -1; j--) {
      newRow.push(grid[j][i]);
    }
    reversedGrid.push(newRow);
  }
  return reversedGrid;
}
function createGridBoard(gameBoard: HTMLCanvasElement, grid: grid) {
  gameBoard.width = grid[0].length * BLOCKW;
  gameBoard.height = grid.length * BLOCKH;
}

export type { grid };
export {
  createGrid,
  updateGrid,
  createGridBoard,
  rotateGrid,
  scaleInternalToGameboardGrid,
  setBlockPosToInternalGridPos,
  clearGrid,
};
