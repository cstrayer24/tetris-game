import { BLOCKH, BLOCKW } from "./constants.js";
import { LeftwardZigZag, Square, Straight, Tri, RightwardZigZag, LeftwardL, RightwardL, } from "./peices.js";
const gameBoard = document.querySelector("#gamecanvas");
const ctx = gameBoard.getContext("2d");
const controlButton = document.querySelector("#ctlbtn");
const peices = [
    LeftwardZigZag,
    RightwardZigZag,
    Square,
    Straight,
    Tri,
    RightwardL,
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
function playGame(ctx) {
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
