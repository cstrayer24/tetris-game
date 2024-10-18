import { BLOCKH, BLOCKW } from "./constants.js";
const isAtBottom = (ctx, peice) => !!peice.dumpBlocks().find((v) => v.y >= ctx.canvas.height - BLOCKH);
const isAtRightBarrier = (ctx, peice) => !!peice.dumpBlocks().find((v) => v.x >= ctx.canvas.width - BLOCKW);
const isAtLeftBarrier = (ctx, peice) => !!peice.dumpBlocks().find((v) => v.x <= BLOCKW / 2);
const hasPieceBellow = (peice1, peice2) => {
    let isTouching = false;
    peice1.dumpBlocks().forEach((v1) => {
        if (peice2.dumpBlocks().find((v2) => v1.y === v2.y - BLOCKH && v1.x === v2.x)) {
            isTouching = true;
        }
    });
    return isTouching;
};
const hasPieceOnRight = (piece1, piece2) => {
    let isTouching = false;
    piece1.dumpBlocks().forEach((v1) => {
        if (piece2.dumpBlocks().find((v2) => v1.x === v2.x + BLOCKW && v1.y === v2.y)) {
            isTouching = true;
        }
    });
    return isTouching;
};
const hasPieceOnLeft = (piece1, piece2) => {
    let isTouching = false;
    piece1.dumpBlocks().forEach((v1) => {
        if (piece2.dumpBlocks().find((v2) => v1.x === v2.x - BLOCKW && v1.y === v2.y)) {
            isTouching = true;
        }
    });
    return isTouching;
};
export { isAtBottom, isAtRightBarrier, isAtLeftBarrier, hasPieceBellow, hasPieceOnRight, hasPieceOnLeft, };
