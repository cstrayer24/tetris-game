const isAtTop = (piece, grid) => !!piece.blks.find((v) => v.y <= 0);
const isAtBottom = (peice, grid) => !!peice.blks.find((v) => v.y >= grid.length - 1);
const isAtRightBarrier = (peice, grid) => !!peice.blks.find((v) => v.x >= grid[0].length - 1);
const isAtLeftBarrier = (peice, grid) => !!peice.blks.find((v) => v.x <= 0);
const hasPieceBellow = (peice, grid) => {
    let isTouching = false;
    peice.blks.forEach((v) => {
        if (v.y === grid.length - 1 ||
            (grid[v.y + 1][v.x] !== undefined &&
                !peice.blks.includes(grid[v.y + 1][v.x]))) {
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
function dropBlocks(grid) {
    if (grid.every((row) => row.every((blk) => blk === undefined))) {
        return;
    }
    let topMostNonEmptyRow = grid.findIndex((row) => !row.every((blk) => blk === undefined));
    let bottomMostEmptyRow = grid.findLastIndex((row) => row.every((blk) => blk === undefined));
    let state = 1;
    let nonEmptyRow = topMostNonEmptyRow;
    const nonEmptyRows = [];
    let emptyRow = -1;
    let pullDownAmnt = 0;
    while (topMostNonEmptyRow < bottomMostEmptyRow) {
        switch (state) {
            case 1:
                if (nonEmptyRow >= grid.length) {
                    state = 3;
                    continue;
                }
                if (grid[nonEmptyRow].every((blk) => blk === undefined)) {
                    emptyRow = nonEmptyRow;
                    state = 2;
                    continue;
                }
                nonEmptyRows.push(nonEmptyRow);
                nonEmptyRow++;
                break;
            case 2:
                if (emptyRow >= grid.length) {
                    state = 3;
                    continue;
                }
                if (!grid[emptyRow].every((blk) => blk === undefined)) {
                    state = 3;
                    continue;
                }
                pullDownAmnt++;
                emptyRow++;
                break;
            case 3:
                while (nonEmptyRows.length != 0) {
                    const currRow = nonEmptyRows.pop();
                    for (let i = 0; i < grid[currRow].length; i++) {
                        if (grid[currRow][i] === undefined) {
                            continue;
                        }
                        const currBlock = grid[currRow][i];
                        currBlock.y += pullDownAmnt;
                        grid[currBlock.y][currBlock.x] = currBlock;
                    }
                }
                topMostNonEmptyRow = grid.findIndex((row) => !row.every((blk) => blk === undefined));
                nonEmptyRow = topMostNonEmptyRow;
                bottomMostEmptyRow = grid.findLastIndex((row) => row.every((blk) => blk === undefined));
                state = 1;
                break;
        }
    }
}
function dropPeice(peice, grid) {
    const initalY = peice.y;
    while (!hasPieceBellow(peice, grid) && !isAtBottom(peice, grid)) {
        peice.y += 1;
    }
    return Math.max(peice.y - initalY, 1);
}
export { isAtBottom, isAtTop, isAtRightBarrier, isAtLeftBarrier, hasPieceBellow, hasPieceOnRight, hasPieceOnLeft, dropBlocks, dropPeice, };
