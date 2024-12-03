import { clrscrn, drawBlock, drawGridLines } from "./drawUtils.js";
import {
  updateGrid,
  createGrid,
  createGridBoard,
  grid,
  clearGrid,
} from "./grid.js";
import {
  LeftwardZigZag,
  Square,
  Straight,
  Tri,
  RightwardZigZag,
  LeftwardL,
  RightwardL,
  Tetriminoe,
} from "./peices.js";
import {
  isAtBottom,
  isAtRightBarrier,
  isAtLeftBarrier,
  hasPieceBellow,
  hasPieceOnRight,
  hasPieceOnLeft,
  isAtTop,
} from "./physics.js";
type timing_t = {
  interval: number;
  lastTime: number;
};
type game = {
  isPlaying: boolean;
  currPeice: Tetriminoe;
  grid: grid;
  frameRef: number;
  gameBoard: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  timing: timing_t;
  hasEvents: boolean;
};

const Game: game = {} as game;
const controlButton: HTMLButtonElement = document.querySelector("#ctlbtn");

function getRandomBlock(): Tetriminoe {
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
function initGame(Game: game, canvas: HTMLCanvasElement) {
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

function handleInput(Game: game, ev: KeyboardEvent) {
  const { currPeice, grid } = Game;
  switch (ev.key) {
    case "ArrowRight":
      if (
        !isAtRightBarrier(currPeice, grid) &&
        !hasPieceOnRight(currPeice, grid)
      ) {
        currPeice.x += 1;
      }
      updateGrid(grid, currPeice);
      break;
    case "ArrowLeft":
      if (
        !isAtLeftBarrier(currPeice, grid) &&
        !hasPieceOnLeft(currPeice, grid)
      ) {
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
      if (
        isAtRightBarrier(currPeice, grid) ||
        hasPieceOnRight(currPeice, grid)
      ) {
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

function bindEvents(Game: game) {
  window.onkeydown = (ev) => handleInput(Game, ev);
  Game.hasEvents = true;
}

function releaseEvents(Game: game) {
  window.onkeydown = (ev) => handleInput(Game, ev);
  Game.hasEvents = false;
}
function renderGame(Game: game) {
  Game.grid.forEach((v1) => {
    v1.forEach((v2) => {
      if (typeof v2 !== "undefined") drawBlock(v2, Game.ctx);
    });
  });
  drawGridLines(Game.ctx, Game.grid);
}
function playGame(Game: game) {
  Game.isPlaying = true;
  Game.currPeice = getRandomBlock();
  bindEvents(Game);
  const animationLoop = (t) => {
    Game.frameRef = requestAnimationFrame(animationLoop);
    if (t - Game.timing.lastTime >= Game.timing.interval) {
      Game.currPeice.y += 1;
      Game.timing.lastTime = t;
    }
    clrscrn(Game.ctx);
    updateGrid(Game.grid, Game.currPeice);
    if (
      isAtBottom(Game.currPeice, Game.grid) ||
      hasPieceBellow(Game.currPeice, Game.grid)
    ) {
      Game.currPeice = getRandomBlock();
    }
    renderGame(Game);
  };
  Game.frameRef = requestAnimationFrame(animationLoop);
}
function stopGame(Game: game) {
  cancelAnimationFrame(Game.frameRef);
  Game.isPlaying = false;
  Game.currPeice = null;
  releaseEvents(Game);
  clearGrid(Game.grid);
  clrscrn(Game.ctx);
}
window.addEventListener("DOMContentLoaded", (ev) => {
  initGame(Game, document.querySelector("#gamecanvas"));
});
controlButton.addEventListener("click", (ev) => {
  Game.isPlaying = !Game.isPlaying;
  if (Game.isPlaying) {
    playGame(Game);
    controlButton.innerText = "stop";
  } else {
    stopGame(Game);
    controlButton.innerText = "start";
  }
});
