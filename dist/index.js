import { clrscrn, drawBlock, drawGridLines } from "./drawUtils.js";
import { updateGrid, createGrid, createGridBoard, clearGrid, } from "./grid.js";
import { LeftwardZigZag, Square, Straight, Tri, RightwardZigZag, LeftwardL, RightwardL, } from "./peices.js";
import { isAtBottom, isAtRightBarrier, isAtLeftBarrier, hasPieceBellow, hasPieceOnRight, hasPieceOnLeft, isAtTop, } from "./physics.js";
const Game = {};
const controlButton = document.querySelector("#ctlbtn");
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
function initGame(Game, canvas) {
    Game.grid = createGrid(10, 22);
    Game.gameBoard = canvas;
    Game.ctx = Game.gameBoard.getContext("2d");
    createGridBoard(Game.gameBoard, Game.grid);
    Game.isPlaying = false;
    Game.timing = {
        interval: 1000,
        lastTime: 0,
    };
}
function handleInput(Game, ev) {
    const { currPeice, grid } = Game;
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
}
function bindEvents(Game) {
    window.onkeydown = (ev) => handleInput(Game, ev);
    Game.hasEvents = true;
}
function releaseEvents(Game) {
    window.onkeydown = (ev) => handleInput(Game, ev);
    Game.hasEvents = false;
}
function renderGame(Game) {
    Game.grid.forEach((v1) => {
        v1.forEach((v2) => {
            if (typeof v2 !== "undefined")
                drawBlock(v2, Game.ctx);
        });
    });
    drawGridLines(Game.ctx, Game.grid);
}
function playGame(Game) {
    Game.isPlaying = true;
    Game.currPeice = getRandomBlock();
    bindEvents(Game);
    const animationLoop = (t) => {
        if (!Game.isPlaying) {
            return;
        }
        Game.frameRef = requestAnimationFrame(animationLoop);
        if (t - Game.timing.lastTime >= Game.timing.interval) {
            Game.currPeice.y += 1;
            Game.timing.lastTime = t;
        }
        clrscrn(Game.ctx);
        updateGrid(Game.grid, Game.currPeice);
        renderGame(Game);
        if (isAtBottom(Game.currPeice, Game.grid) ||
            hasPieceBellow(Game.currPeice, Game.grid)) {
            Game.currPeice = getRandomBlock();
        }
        if (isAtTop(Game.currPeice, Game.grid) &&
            hasPieceBellow(Game.currPeice, Game.grid)) {
            updateGrid(Game.grid, Game.currPeice);
            return doGameOver(Game);
        }
    };
    Game.frameRef = requestAnimationFrame(animationLoop);
}
function stopGame(Game) {
    cancelAnimationFrame(Game.frameRef);
    Game.isPlaying = false;
    Game.currPeice = null;
    releaseEvents(Game);
    clearGrid(Game.grid);
    clrscrn(Game.ctx);
}
function resetGame(Game) {
    stopGame(Game);
    playGame(Game);
}
function doGameOver(Game) {
    const gameOverContainer = document.querySelector("#gameOverUi");
    const resetBtn = document.querySelector("#resetBtn");
    const ctlButton = document.querySelector("#ctlbtn");
    ctlButton.disabled = true;
    Game.isPlaying = false;
    gameOverContainer.style.display = "grid";
    renderGame(Game);
    resetBtn.onclick = (ev) => {
        resetGame(Game);
        ctlButton.disabled = false;
        gameOverContainer.style.display = "none";
    };
}
window.addEventListener("DOMContentLoaded", (ev) => {
    initGame(Game, document.querySelector("#gamecanvas"));
});
controlButton.addEventListener("click", (ev) => {
    Game.isPlaying = !Game.isPlaying;
    if (Game.isPlaying) {
        playGame(Game);
        controlButton.innerText = "stop";
    }
    else {
        stopGame(Game);
        controlButton.innerText = "start";
    }
});
