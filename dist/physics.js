const isAtTop = (piece, grid) => !!piece.blks.find((v) => v.y <= 0);
const isAtBottom = (peice, grid) => !!peice.blks.find((v) => v.y >= grid.length - 1);
const isAtRightBarrier = (peice, grid) => !!peice.blks.find((v) => v.x >= grid[0].length - 1);
const isAtLeftBarrier = (peice, grid) => !!peice.blks.find((v) => v.x <= 0);
const hasPieceBellow = (peice, grid) => {
    let isTouching = false;
    peice.blks.forEach((v) => {
        if (typeof grid[v.y + 1][v.x] !== "undefined" &&
            !peice.blks.includes(grid[v.y + 1][v.x])) {
            isTouching = true;
        }
    });
    return isTouching;
};
const hasPieceOnRight = (piece, grid) => {
    let isTouching = false;
    const sortedBlocks = structuredClone(piece.blks).sort((a, b) => a.x - b.x);
    const rightMostBlocks = sortedBlocks.filter((v) => sortedBlocks[sortedBlocks.length - 1].x <= v.x);
    rightMostBlocks.forEach((v) => {
        if (typeof grid[v.y][v.x + 1] !== "undefined") {
            isTouching = true;
        }
    });
    return isTouching;
};
const hasPieceOnLeft = (piece, grid) => {
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
function dropBlocks(grid, numClearedRows) {
    if (grid.every((row) => row.every((blk) => blk === undefined))) {
        return;
    }
    let bottomMostEmptyRow = grid.findLastIndex((row) => row.every((blk) => blk === undefined));
    let topMostNonEmptyRow = grid.findIndex((row) => !row.every((blk) => blk === undefined));
    let nonEmptyRow = bottomMostEmptyRow - numClearedRows;
    const nonEmptyRows = [];
    let iterCount = 0;
    while (topMostNonEmptyRow < bottomMostEmptyRow) {
        if (grid[nonEmptyRow].every((blk) => blk === undefined)) {
            nonEmptyRows.unshift(nonEmptyRow);
            const pullDownAmnt = numClearedRows;
            while (nonEmptyRows.length != 0) {
                const currRow = nonEmptyRows.pop();
                for (let j = 0; j < grid[currRow].length; j++) {
                    if (grid[currRow][j] === undefined) {
                        continue;
                    }
                    const currBlock = grid[currRow][j];
                    currBlock.y += pullDownAmnt;
                    grid[currBlock.y][currBlock.x] = currBlock;
                }
            }
            bottomMostEmptyRow = grid.findLastIndex((row) => row.every((blk) => blk === undefined));
            topMostNonEmptyRow = grid.findIndex((row) => !row.every((blk) => blk === undefined));
            nonEmptyRow = bottomMostEmptyRow - numClearedRows;
        }
        else {
            nonEmptyRows.unshift(nonEmptyRow);
            nonEmptyRow--;
        }
        iterCount++;
        if (iterCount >= 100) {
            break;
        }
    }
}
function dropPeice(peice, grid) {
    let rowsDropped = 0;
    while (!hasPieceBellow(peice, grid) && !isAtBottom(peice, grid)) {
        peice.y += 1;
        rowsDropped++;
    }
    return rowsDropped;
}
export { isAtBottom, isAtTop, isAtRightBarrier, isAtLeftBarrier, hasPieceBellow, hasPieceOnRight, hasPieceOnLeft, dropBlocks, dropPeice, };
