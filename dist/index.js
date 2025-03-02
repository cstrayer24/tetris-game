import { clrscrn, drawBlock, drawGridLines } from "./drawUtils.js";
import { updateGrid, createGrid, createGridBoard, clearGrid, } from "./grid.js";
import { LeftwardZigZag, Square, Straight, Tri, RightwardZigZag, LeftwardL, RightwardL, } from "./peices.js";
import { isAtBottom, isAtRightBarrier, isAtLeftBarrier, hasPieceBellow, hasPieceOnRight, hasPieceOnLeft, isAtTop, dropBlocks, dropPeice, } from "./physics.js";
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
function updateScoreBoard(Game) {
    Game.scoreBoard.textContent = `${Game.score}`;
}
function initGame(Game, canvas) {
    Game.grid = createGrid(10, 22);
    Game.gameBoard = canvas;
    Game.ctx = Game.gameBoard.getContext("2d");
    createGridBoard(Game.gameBoard, Game.grid);
    Game.isPlaying = false;
    Game.timing = {
        interval: 800,
        lastTime: 0,
    };
    Game.scoreBoard = document.querySelector("#scoreBoard");
    Game.score = 0;
    Game.scoreMultiplier = 1;
    Game.linesCleared = 0;
    Game.nextLineThreshold = 10;
}
function handleInput(Game, ev) {
    const { currPeice, grid } = Game;
    switch (ev.key) {
        case "ArrowRight":
            if (!isAtRightBarrier(currPeice, grid) &&
                !hasPieceOnRight(currPeice, grid)) {
                currPeice.x++;
            }
            updateGrid(grid, currPeice);
            break;
        case "ArrowLeft":
            if (!isAtLeftBarrier(currPeice, grid) &&
                !hasPieceOnLeft(currPeice, grid)) {
                currPeice.x--;
            }
            updateGrid(grid, currPeice);
            break;
        case "ArrowDown":
            if (!isAtBottom(currPeice, grid) && !hasPieceBellow(currPeice, grid)) {
                currPeice.y++;
                Game.score++;
                updateScoreBoard(Game);
            }
            updateGrid(grid, currPeice);
            break;
        case "ArrowUp":
            currPeice.rotate(grid);
            //wall kicks
            while (currPeice.blks.find((blk) => blk.y < 0)) {
                currPeice.y += 1;
            }
            while (currPeice.blks.find((blk) => blk.x < 0)) {
                currPeice.x += 1;
            }
            while (currPeice.blks.find((blk) => blk.x >= Game.grid[0].length)) {
                currPeice.x -= 1;
            }
            updateGrid(grid, currPeice);
            break;
        case " ":
            const rowsDropped = dropPeice(currPeice, grid);
            Game.score += rowsDropped;
            updateScoreBoard(Game);
            updateGrid(grid, currPeice);
            handleDrop(Game);
            break;
        case "c":
            Game.currPeice.blks.forEach((blk) => {
                grid[blk.y][blk.x] = undefined;
            });
            Game.currPeice = getRandomBlock();
            break;
    }
}
function bindEvents(Game) {
    window.onkeydown = (ev) => handleInput(Game, ev);
    Game.hasEvents = true;
}
function releaseEvents(Game) {
    window.onkeydown = (ev) => undefined;
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
    Game.timeoutRef = 0;
    bindEvents(Game);
    const animationLoop = (t) => {
        if (!Game.isPlaying) {
            return;
        }
        Game.frameRef = requestAnimationFrame(animationLoop);
        if (t - Game.timing.lastTime >= Game.timing.interval) {
            if (!(isAtBottom(Game.currPeice, Game.grid) ||
                hasPieceBellow(Game.currPeice, Game.grid))) {
                Game.currPeice.y++;
            }
            Game.timing.lastTime = t;
        }
        clrscrn(Game.ctx);
        updateGrid(Game.grid, Game.currPeice);
        renderGame(Game);
        if (isAtBottom(Game.currPeice, Game.grid) ||
            hasPieceBellow(Game.currPeice, Game.grid)) {
            if (Game.timeoutRef === 0) {
                Game.timeoutRef = setTimeout(() => {
                    handleDrop(Game);
                    Game.timeoutRef = 0;
                }, 1000);
            }
        }
        if (Game.linesCleared >= Game.nextLineThreshold) {
            Game.scoreMultiplier++;
            Game.nextLineThreshold += 10;
            Game.timing.interval =
                (Math.max(48 - 5 * Game.scoreMultiplier, 1) / 60) * 1000;
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
    Game.score = 0;
    Game.scoreMultiplier = 1;
    Game.linesCleared = 0;
    Game.nextLineThreshold = 10;
    Game.timing.interval = 800;
    updateScoreBoard(Game);
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
function handleDrop(Game) {
    if (!(hasPieceBellow(Game.currPeice, Game.grid) ||
        isAtBottom(Game.currPeice, Game.grid))) {
        return;
    }
    Game.currPeice = getRandomBlock();
    const filledRows = Game.grid.filter((v) => !v.includes(undefined));
    for (let i = 0; i < filledRows.length; i++) {
        const blk = filledRows[i][0];
        Game.grid[blk.y] = Game.grid[blk.y].map(() => undefined);
    }
    if (filledRows.length > 0) {
        dropBlocks(Game.grid);
        Game.linesCleared += filledRows.length;
        Game.score += filledRows.length * 100 * Game.scoreMultiplier;
        updateScoreBoard(Game);
    }
}
function doGameOver(Game) {
    const gameOverContainer = document.querySelector("#gameOverUi");
    const resetBtn = document.querySelector("#resetBtn");
    const ctlButton = document.querySelector("#ctlbtn");
    const finalGameScore = document.querySelector("#finalGameScore");
    ctlButton.disabled = true;
    Game.isPlaying = false;
    finalGameScore.innerText = `score:${Game.score}`;
    gameOverContainer.style.display = "grid";
    renderGame(Game);
    releaseEvents(Game);
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
        // do this so you can do a hard drop without it pressing the control button again
        controlButton.blur();
    }
    else {
        stopGame(Game);
        controlButton.innerText = "start";
        controlButton.blur();
    }
});
