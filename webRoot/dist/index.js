import { clrscrn, drawBlock, drawGridLines } from "./drawUtils.js";
import { updateGrid, createGrid, createGridBoard, clearGrid, } from "./grid.js";
import { LeftwardZigZag, Square, Straight, Tri, RightwardZigZag, LeftwardL, RightwardL, } from "./pieces.js";
import { isAtRightBarrier, isAtLeftBarrier, hasPieceBellow, hasPieceOnRight, hasPieceOnLeft, isAtTop, dropBlocks, dropPiece, } from "./physics.js";
import { colorTextureLUT, GRIDH, GRIDW, TEXTUREWRAPPERID, } from "./constants.js";
const Game = {};
const controlButton = document.querySelector("#ctlbtn");
function getRandomBlock(x, y) {
    const pieces = [
        LeftwardZigZag,
        RightwardZigZag,
        Square,
        Straight,
        Tri,
        RightwardL,
        LeftwardL,
    ];
    return new pieces[Math.floor(Math.random() * pieces.length)](x, y);
}
function updateScoreBoard(Game) {
    Game.scoreBoard.textContent = `${Game.score}`;
}
function init_textures() {
    const wrapperEl = document.createElement("div");
    wrapperEl.id = `${TEXTUREWRAPPERID}`;
    wrapperEl.style.display = "none";
    document.body.appendChild(wrapperEl);
    const colors = Object.keys(colorTextureLUT);
    for (let i = 0; i < colors.length; i++) {
        const img = new Image();
        img.src = colorTextureLUT[colors[i]];
        img.id = `texture_${colors[i]}`;
        wrapperEl.appendChild(img);
    }
}
function initGame(Game, canvas) {
    Game.grid = createGrid(GRIDW, GRIDH);
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
    init_textures();
}
function handleInput(Game, ev, inputMap) {
    if (Object.keys(inputMap).includes(ev.key) && inputMap[ev.key]) {
        return;
    }
    if (Object.keys(inputMap).includes(ev.key)) {
        inputMap[ev.key] = true;
    }
    const { currPiece, grid } = Game;
    switch (ev.key) {
        case "ArrowRight":
            if (!isAtRightBarrier(currPiece, grid) &&
                !hasPieceOnRight(currPiece, grid)) {
                currPiece.x++;
            }
            updateGrid(grid, currPiece);
            break;
        case "ArrowLeft":
            if (!isAtLeftBarrier(currPiece, grid) &&
                !hasPieceOnLeft(currPiece, grid)) {
                currPiece.x--;
            }
            updateGrid(grid, currPiece);
            break;
        case "ArrowDown":
            if (!hasPieceBellow(currPiece, grid)) {
                currPiece.y++;
                Game.score++;
                updateScoreBoard(Game);
            }
            updateGrid(grid, currPiece);
            break;
        case "ArrowUp":
            currPiece.rotate(grid);
            //wall kicks
            while (currPiece.blks.find((blk) => blk.y < 0)) {
                currPiece.y++;
            }
            while (currPiece.blks.find((blk) => blk.x < 0)) {
                currPiece.x++;
            }
            while (currPiece.blks.find((blk) => blk.x >= Game.grid[0].length)) {
                currPiece.x--;
            }
            updateGrid(grid, currPiece);
            break;
        case " ":
            const rowsDropped = dropPiece(currPiece, grid);
            Game.score += rowsDropped;
            updateScoreBoard(Game);
            updateGrid(grid, currPiece);
            handleDrop(Game);
            break;
    }
}
function bindEvents(Game) {
    const inputMap = {
        //user should be able to hold right left or down
        // ArrowRight: false,
        // ArrowLeft: false,
        // ArrowDown: false,
        ArrowUp: false,
        " ": false,
    };
    window.onkeydown = (ev) => handleInput(Game, ev, inputMap);
    window.onkeyup = (ev) => {
        if (Object.keys(inputMap).includes(ev.key)) {
            inputMap[ev.key] = false;
        }
    };
    Game.hasEvents = true;
}
function releaseEvents(Game) {
    window.onkeydown = () => undefined;
    window.onkeyup = () => undefined;
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
    Game.currPiece = getRandomBlock(Game.grid[0].length / 2, 0);
    Game.timeoutRef = 0;
    bindEvents(Game);
    const animationLoop = (t) => {
        if (!Game.isPlaying) {
            return;
        }
        Game.frameRef = requestAnimationFrame(animationLoop);
        if (t - Game.timing.lastTime >= Game.timing.interval) {
            if (!hasPieceBellow(Game.currPiece, Game.grid)) {
                Game.currPiece.y++;
            }
            Game.timing.lastTime = t;
        }
        clrscrn(Game.ctx);
        updateGrid(Game.grid, Game.currPiece);
        renderGame(Game);
        if (hasPieceBellow(Game.currPiece, Game.grid)) {
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
        if (isAtTop(Game.currPiece, Game.grid) &&
            hasPieceBellow(Game.currPiece, Game.grid)) {
            updateGrid(Game.grid, Game.currPiece);
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
    Game.currPiece = null;
    releaseEvents(Game);
    clearGrid(Game.grid);
    clrscrn(Game.ctx);
}
function resetGame(Game) {
    stopGame(Game);
    playGame(Game);
}
function handleDrop(Game) {
    if (!hasPieceBellow(Game.currPiece, Game.grid)) {
        return;
    }
    Game.currPiece = getRandomBlock(Game.grid[0].length / 2, 0);
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
