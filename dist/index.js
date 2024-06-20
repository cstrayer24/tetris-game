import { RightwardL, } from "./peices.js";
const gameBoard = document.querySelector("#gamecanvas");
const ctx = gameBoard.getContext("2d");
const controlButton = document.querySelector("#ctlbtn");
let currPeice = new RightwardL(gameBoard.width / 2, 0, "orange");
function playGame(ctx) {
    let rAF = requestAnimationFrame((t) => playGame(ctx));
    currPeice.draw(ctx);
}
controlButton.addEventListener("click", (ev) => {
    playGame(ctx);
});
