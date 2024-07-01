import { BLOCKH, BLOCKW } from "./constants.js";
import {
  LeftwardZigZag,
  Square,
  Straight,
  Tri,
  RightwardZigZag,
  LeftwardL,
  RightwardL,
} from "./peices.js";

const gameBoard: HTMLCanvasElement = document.querySelector("#gamecanvas");
const ctx: CanvasRenderingContext2D = gameBoard.getContext("2d");
const controlButton: HTMLButtonElement = document.querySelector("#ctlbtn");
const peices = [
  LeftwardZigZag, //needs logic
  RightwardZigZag, //needs logic
  Square,
  Straight,
  Tri, //needs logic
  RightwardL, //needs logic
  LeftwardL, //needs logic
];
let playingGame = false;
let currPeice = new RightwardL(gameBoard.width / 2, 0);
const timing = {
  interval: 500,
  lastTime: 0,
};
addEventListener("keydown", (ev) => {
  switch (ev.key) {
    case "ArrowRight":
      currPeice.x += BLOCKW;
      currPeice.clearRight(ctx);
      break;
    case "ArrowLeft":
      currPeice.x -= BLOCKW;
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
    requestAnimationFrame(animationLoop);
    if (t - timing.lastTime >= timing.interval) {
      currPeice.clearAbove(ctx);
      currPeice.y += BLOCKH;
      timing.lastTime = t;
    }
    currPeice.draw(ctx);
  };
  requestAnimationFrame(animationLoop);
}
controlButton.addEventListener("click", (ev) => {
  playingGame = !playingGame;
  if (playingGame) {
    playGame(ctx);
  }
});
