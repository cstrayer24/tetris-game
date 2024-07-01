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
import { isAtBottom, isAtRightBarrier, isAtLeftBarrier } from "./physics.js";

const gameBoard: HTMLCanvasElement = document.querySelector("#gamecanvas");
const ctx: CanvasRenderingContext2D = gameBoard.getContext("2d");
const controlButton: HTMLButtonElement = document.querySelector("#ctlbtn");
const peices = [
  LeftwardZigZag,
  RightwardZigZag,
  Square,
  Straight,
  Tri,
  RightwardL,
  LeftwardL,
];

const droppedPeices: Tetriminoe[] = [];
let playingGame = false;
let currPeice: Tetriminoe = new peices[
  Math.floor(Math.random() * peices.length - 1)
](gameBoard.width / 2, 0);
let rAf;
const timing = {
  interval: 1000,
  lastTime: 0,
};
addEventListener("keydown", (ev) => {
  switch (ev.key) {
    case "ArrowRight":
      if (!isAtRightBarrier(ctx, currPeice)) {
        currPeice.x += BLOCKW;
      }
      currPeice.clearRight(ctx);
      break;
    case "ArrowLeft":
      if (!isAtLeftBarrier(ctx, currPeice)) {
        currPeice.x -= BLOCKW;
      }
      currPeice.clearLeft(ctx);
      break;
    case "ArrowDown":
      currPeice.y += BLOCKH;
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

    currPeice.draw(ctx);
    droppedPeices.forEach((v) => {
      v.draw(ctx);
    });
    // if (currPeice.y >= ctx.canvas.height - BLOCKH * 2) {
    //   droppedPeices.push(currPeice);
    //   currPeice = new peices[Math.floor(Math.random() * peices.length)](
    //     ctx.canvas.width / 2,
    //     0
    //   );
    // }
    if (isAtBottom(ctx, currPeice)) {
      droppedPeices.push(currPeice);
      currPeice = new peices[Math.floor(Math.random() * peices.length)](
        ctx.canvas.width / 2,
        0
      );
    }
  };
  rAf = requestAnimationFrame(animationLoop);
}

function stopGame(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  cancelAnimationFrame(rAf);
  currPeice = new peices[Math.floor(Math.random() * peices.length)](
    gameBoard.width / 2,
    0
  );
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
