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
// let currPeice = new peices[Math.floor(Math.random() * peices.length)](
//   gameBoard.width / 2,
//   0
// );
let currPeice = new LeftwardZigZag(gameBoard.width / 2, 0);
addEventListener("keydown", (ev) => {
  switch (ev.key) {
    case "ArrowRight":
      currPeice.x += 6;
      currPeice.clearRight(ctx);
      break;
    case "ArrowLeft":
      currPeice.x -= 6;
      currPeice.clearLeft(ctx);
      break;
    case "ArrowDown":
      currPeice.y += 6;
      // currPeice.clearAbove(ctx);
      break;
    case "ArrowUp":
      break;
  }
});
function playGame(ctx: CanvasRenderingContext2D) {
  let rAF = requestAnimationFrame((t) => playGame(ctx));

  currPeice.clearAbove(ctx);
  currPeice.y += 1;
  currPeice.draw(ctx);
}
controlButton.addEventListener("click", (ev) => {
  // playGame(ctx);

});
