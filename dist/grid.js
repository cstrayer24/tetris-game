import { BLOCKH, BLOCKW } from "./constants.js";
function createGrid(w, h) {
    const grid = [];
    for (let i = 0; i < h; i++) {
        const row = new Array(w).fill(undefined);
        grid.push(row);
    }
    return grid;
}
function updateGrid(grid, peice, isInternalGrid) {
    const blks = peice.dumpBlocks();
    const xKey = isInternalGrid ? "ix" : "x";
    const yKey = isInternalGrid ? "iy" : "y";
    blks.forEach((v) => {
        grid[v[yKey]][v[xKey]] = v;
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
function setBlockPosToInternalGridPos(Igrid) {
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
function resetBlockGridPosition(grid, BaseBlock) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (typeof grid[i][j] === "undefined") {
                continue;
            }
            grid[i][j].x = BaseBlock.x;
            grid[i][j].y = BaseBlock.y;
        }
    }
}
function scaleInternalToGameboardGrid(Igrid, BaseBlock) {
    resetBlockGridPosition(Igrid, BaseBlock);
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
function reverseRows(grid) {
    const reverseGrid = [];
    for (let i = grid.length - 1; i >= 0; i--) {
        reverseGrid.push(grid[i]);
    }
    console.log(reverseGrid);
    return reverseGrid;
}
function swapRowsAndCols(grid) {
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
function scaleInternalToGameboardGridX(Igrid, BaseBlock) {
    for (let i = 0; i < Igrid.length; i++) {
        for (let j = 0; j < Igrid[i].length; j++) {
            if (typeof Igrid[i][j] === "undefined") {
                continue;
            }
            Igrid[i][j].x += Igrid[i][j].ix - BaseBlock.ix;
        }
    }
}
function scaleInternalToGameboardGridY(Igrid, BaseBlock) {
    for (let i = 0; i < Igrid.length; i++) {
        for (let j = 0; j < Igrid[i].length; j++) {
            if (typeof Igrid[i][j] === "undefined") {
                continue;
            }
            Igrid[i][j].y += Igrid[i][j].iy - BaseBlock.iy;
        }
    }
}
function createGridBoard(gameBoard, grid) {
    gameBoard.width = grid[0].length * BLOCKW;
    gameBoard.height = grid.length * BLOCKH;
}
export { createGrid, updateGrid, createGridBoard, swapRowsAndCols, scaleInternalToGameboardGrid, scaleInternalToGameboardGridX, scaleInternalToGameboardGridY, setBlockPosToInternalGridPos, reverseRows, };
