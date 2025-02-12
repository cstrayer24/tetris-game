import { BLOCKH, BLOCKW } from "./constants.js";
import { Block, Tetriminoe } from "./peices.js";

type grid = Block[][];

function createGrid(w: number, h: number): grid {
  const grid = [];
  for (let i = 0; i < h; i++) {
    const row = new Array(w).fill(undefined);
    grid.push(row);
  }
  return grid;
}
function updateGrid(grid: grid, peice: Tetriminoe, isInternalGrid?: boolean) {
  const blks = peice.blks;
  const xKey = isInternalGrid ? "ix" : "x";
  const yKey = isInternalGrid ? "iy" : "y";
  blks.forEach((v) => {
    try {
      grid[v[yKey]][v[xKey]] = v;
    } catch (error) {
      debugger;
    }
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
function resetBlockToAnchorBlock(grid: grid, AnchorBlock: Block) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (typeof grid[i][j] === "undefined") {
        continue;
      }
      grid[i][j].x = AnchorBlock.x;
      grid[i][j].y = AnchorBlock.y;
    }
  }
}
function scaleInternalToGameboardGrid(Igrid: grid, BaseBlock: Block) {
  resetBlockToAnchorBlock(Igrid, BaseBlock);
  for (let i = 0; i < Igrid.length; i++) {
    for (let j = 0; j < Igrid[i].length; j++) {
      if (typeof Igrid[i][j] === "undefined") {
        continue;
      }

      Igrid[i][j].y += Igrid[i][j].iy - BaseBlock.iy;
      Igrid[i][j].x += Igrid[i][j].ix - BaseBlock.ix;
    }
  }
}
function reverseRows(grid: grid) {
  const reverseGrid = [];
  for (let i = grid.length - 1; i >= 0; i--) {
    reverseGrid.push(grid[i]);
  }
  return reverseGrid;
}
function swapRowsAndCols(grid: grid) {
  const reversedGrid = [];
  for (let i = 0; i < grid[0].length; i++) {
    const newRow = [];
    for (let j = 0; j < grid.length; j++) {
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
  swapRowsAndCols,
  scaleInternalToGameboardGrid,
  setBlockPosToInternalGridPos,
  reverseRows,
  clearGrid,
};
