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
function updateGrid(grid: grid, peice: Tetriminoe) {
  const blks = peice.dumpBlocks();
  blks.forEach((v) => {
    grid[v.y][v.x] = v;
  });
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (typeof grid[i][j] === "undefined") {
        continue;
      }
      if (grid[i][j].x !== j || grid[i][j].y !== i) {
        grid[i][j] = undefined;
      }
    }
  }
}
function createGridBoard(gameBoard: HTMLCanvasElement, grid: grid) {
  gameBoard.width = grid[0].length * BLOCKW;
  gameBoard.height = grid.length * BLOCKH;
}
export type { grid };
export { createGrid, updateGrid, createGridBoard };
