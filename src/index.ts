import { clearAbove, clearAhead, clearBehind, drawBlock } from "./drawUtils.js";
import {
  Block,
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

let currPeice = new RightwardL(gameBoard.width / 2, 0, "orange");
function playGame(ctx: CanvasRenderingContext2D) {
  let rAF = requestAnimationFrame((t) => playGame(ctx));
  currPeice.draw(ctx);
}
controlButton.addEventListener("click", (ev) => {
  playGame(ctx);
});
