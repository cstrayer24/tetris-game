import { BLOCKH, BLOCKW } from "./constants.js";
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
} from "./physics.js";

const gameBoard: HTMLCanvasElement = document.querySelector("#gamecanvas");
const ctx: CanvasRenderingContext2D = gameBoard.getContext("2d");
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
  return new peices[Math.floor(Math.random() * peices.length)](
    gameBoard.width / 2,
    0
  );
}
const droppedPeices: Tetriminoe[] = [];
let playingGame = false;
let currPeice: Tetriminoe = getRandomBlock();
let rAf;
const timing = {
  interval: 1000,
  lastTime: 0,
};
addEventListener("keydown", (ev) => {
  switch (ev.key) {
    case "ArrowRight":
      console.log(!!droppedPeices.find((v) => hasPieceOnRight(v, currPeice)));
      if (
        !isAtRightBarrier(ctx, currPeice) &&
        !droppedPeices.find((v) => hasPieceOnRight(v, currPeice))
      ) {
        currPeice.x += BLOCKW;
      }
      currPeice.clearRight(ctx);
      break;
    case "ArrowLeft":
      if (
        !isAtLeftBarrier(ctx, currPeice) &&
        !droppedPeices.find((v) => hasPieceOnLeft(v, currPeice))
      ) {
        currPeice.x -= BLOCKW;
      }
      currPeice.clearLeft(ctx);
      break;
    case "ArrowDown":
      if (!droppedPeices.find((v) => hasPieceBellow(v, currPeice))) {
        currPeice.y += BLOCKH;
      }
      currPeice.clearAbove(ctx);
      break;
    case "ArrowUp":
      break;
  }
});
function playGame(ctx: CanvasRenderingContext2D) {
  const animationLoop = (t) => {
    rAf = requestAnimationFrame(animationLoop);
    if (t - timing.lastTime >= timing.interval) {
      currPeice.y += BLOCKH;
      currPeice.clearAbove(ctx);
      timing.lastTime = t;
    }
    if (isAtBottom(ctx, currPeice)) {
      droppedPeices.push(currPeice);
      currPeice = getRandomBlock();
    }
    currPeice.draw(ctx);
    droppedPeices.forEach((v) => {
      if (hasPieceBellow(currPeice, v)) {
        droppedPeices.push(currPeice);
        currPeice = getRandomBlock();
      }
      v.draw(ctx);
    });
  };
  rAf = requestAnimationFrame(animationLoop);
}

function stopGame(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  cancelAnimationFrame(rAf);
  currPeice = getRandomBlock();
  droppedPeices.splice(0, droppedPeices.length);
}
controlButton.addEventListener("click", (ev) => {
  playingGame = !playingGame;
  if (playingGame) {
    playGame(ctx);
    controlButton.innerText = "stop";
  } else {
    stopGame(ctx);
    controlButton.innerText = "start";
  }
});
