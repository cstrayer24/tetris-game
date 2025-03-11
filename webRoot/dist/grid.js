import { BLOCKH, BLOCKW } from "./constants.js";
function createGrid(w, h) {
    return Array.from({ length: h }, () => new Array(w).fill(undefined));
}
function updateGrid(grid, piece, isInternalGrid) {
    const blks = piece.blks;
    const xKey = isInternalGrid ? "ix" : "x";
    const yKey = isInternalGrid ? "iy" : "y";
    blks.forEach((blk) => {
        //this might be unnecessary
        if (blk[yKey] > grid.length - 1 ||
            grid[yKey] < 0 ||
            blk[xKey] > grid[blk[yKey]].length - 1) {
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
function clearGrid(grid) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            grid[i][j] = undefined;
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
function scaleInternalToGameboardGrid(Igrid, BaseBlock) {
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
function rotateGrid(grid) {
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
function createGridBoard(gameBoard, grid) {
    gameBoard.width = grid[0].length * BLOCKW;
    gameBoard.height = grid.length * BLOCKH;
}
export { createGrid, updateGrid, createGridBoard, rotateGrid, scaleInternalToGameboardGrid, setBlockPosToInternalGridPos, clearGrid, };
