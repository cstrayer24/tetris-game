import { drawBlock, drawGridLines } from "./drawUtils.js";
import { updateGrid, createGrid, createGridBoard } from "./grid.js";
import { LeftwardZigZag, Square, Straight, Tri, RightwardZigZag, LeftwardL, RightwardL, } from "./peices.js";
import { isAtBottom, isAtRightBarrier, isAtLeftBarrier, hasPieceBellow, hasPieceOnRight, hasPieceOnLeft, isAtTop, } from "./physics.js";
const gameBoard = document.querySelector("#gamecanvas");
const ctx = gameBoard.getContext("2d");
const controlButton = document.querySelector("#ctlbtn");
let currPeice = getRandomBlock();
let grid = createGrid(10, 22);
const droppedPeices = [];
let playingGame = false;
let rAf;
const timing = {
    interval: 1000,
    lastTime: 0,
};
createGridBoard(gameBoard, grid);
function getRandomBlock() {
    const peices = [
        LeftwardZigZag,
        RightwardZigZag,
        Square,
        Straight,
        Tri,
        RightwardL,
        LeftwardL,
    ];
    return new peices[Math.floor(Math.random() * peices.length)](5, 0);
}
addEventListener("keydown", (ev) => {
    switch (ev.key) {
        case "ArrowRight":
            if (!isAtRightBarrier(currPeice, grid) &&
                !hasPieceOnRight(currPeice, grid)) {
                currPeice.x += 1;
            }
            updateGrid(grid, currPeice);
            break;
        case "ArrowLeft":
            if (!isAtLeftBarrier(currPeice, grid) &&
                !hasPieceOnLeft(currPeice, grid)) {
                currPeice.x -= 1;
            }
            updateGrid(grid, currPeice);
            break;
        case "ArrowDown":
            if (!isAtBottom(currPeice, grid) && !hasPieceBellow(currPeice, grid)) {
                currPeice.y += 1;
            }
            updateGrid(grid, currPeice);
            break;
        case "ArrowUp":
            currPeice.rotate();
            if (isAtLeftBarrier(currPeice, grid) || hasPieceOnLeft(currPeice, grid)) {
                currPeice.x += 1;
            }
            if (isAtRightBarrier(currPeice, grid) ||
                hasPieceOnRight(currPeice, grid)) {
                currPeice.x -= 1;
            }
            if (isAtBottom(currPeice, grid) || hasPieceBellow(currPeice, grid)) {
                currPeice.y -= 1;
            }
            if (isAtTop(currPeice, grid)) {
                currPeice.y += 1;
            }
            updateGrid(grid, currPeice);
            break;
    }
});
function playGame(ctx) {
    const animationLoop = (t) => {
        rAf = requestAnimationFrame(animationLoop);
        if (t - timing.lastTime >= timing.interval) {
            currPeice.y += 1;
            timing.lastTime = t;
        }
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        updateGrid(grid, currPeice);
        if (isAtBottom(currPeice, grid) || hasPieceBellow(currPeice, grid)) {
            currPeice = getRandomBlock();
        }
        grid.forEach((v1) => {
            v1.forEach((v2) => {
                if (typeof v2 !== "undefined")
                    drawBlock(v2, ctx);
            });
        });
        drawGridLines(ctx, grid);
    };
    rAf = requestAnimationFrame(animationLoop);
}
function stopGame(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    cancelAnimationFrame(rAf);
    currPeice = getRandomBlock();
    grid = createGrid(10, 22);
}
controlButton.addEventListener("click", (ev) => {
    playingGame = !playingGame;
    if (playingGame) {
        playGame(ctx);
        controlButton.innerText = "stop";
    }
    else {
        stopGame(ctx);
        controlButton.innerText = "start";
    }
});
