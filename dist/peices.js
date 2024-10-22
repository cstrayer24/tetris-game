import { BLOCKH, BLOCKW } from "./constants.js";
import { drawBlock } from "./drawUtils.js";
class Block {
    constructor(x, y, w, h, color) {
        this.color = color;
        this.h = h;
        this.w = w;
        this.x = x;
        this.y = y;
    }
}
class Tetriminoe {
    constructor(x, y, color) {
        this.px = x;
        this.py = y;
        this.color = color;
    }
    get x() {
        return this.px;
    }
    set x(nx) {
        this.px = nx;
    }
    get y() {
        return this.py;
    }
    set y(ny) {
        this.py = ny;
    }
    draw(ctx) {
        this.blks.forEach((v) => drawBlock(v, ctx));
    }
    dumpBlocks() {
        return this.blks;
    }
    rotate() {
        return;
    }
}
class Straight extends Tetriminoe {
    constructor(x, y) {
        super(x, y, "blue");
        this.isRotated = false;
        this.blks = [
            new Block(this.px, this.py, BLOCKW, BLOCKH, this.color),
            new Block(this.px, this.py + 1, BLOCKW, BLOCKH, this.color),
            new Block(this.px, this.py + 2, BLOCKW, BLOCKH, this.color),
            new Block(this.px, this.py + 3, BLOCKW, BLOCKH, this.color),
        ];
    }
    get x() {
        return this.px;
    }
    set x(nx) {
        this.px = nx;
        this.blks.forEach((v, i) => {
            v.x = this.isRotated ? this.px + 1 * i : this.px;
        });
    }
    get y() {
        return this.py;
    }
    set y(ny) {
        this.py = ny;
        this.blks.forEach((v, i) => {
            v.y = !this.isRotated ? this.py + 1 * i : this.py;
        });
    }
    rotate() {
        this.isRotated = !this.isRotated;
        if (this.isRotated) {
            // this.py = this.blks[0].y;
            this.blks.forEach((v, i) => {
                v.y = this.blks[0].y;
                v.x = this.px + 1 * i;
            });
        }
        else {
            this.blks.forEach((v, i) => {
                v.x = this.blks[0].x;
                v.y = this.py + 1 * i;
            });
        }
    }
}
class Square extends Tetriminoe {
    constructor(x, y) {
        super(x, y, "yellow");
        this.blks = [
            new Block(this.px, this.py, BLOCKW, BLOCKH, this.color),
            new Block(this.px + 1, this.py, BLOCKW, BLOCKH, this.color),
            new Block(this.px, this.py + 1, BLOCKW, BLOCKH, this.color),
            new Block(this.px + 1, this.py + 1, BLOCKW, BLOCKH, this.color),
        ];
    }
    get x() {
        return this.px;
    }
    set x(nx) {
        this.px = nx;
        this.blks[0].x = this.px;
        this.blks[1].x = this.px + 1;
        this.blks[2].x = this.px;
        this.blks[3].x = this.px + 1;
    }
    get y() {
        return this.py;
    }
    set y(ny) {
        this.py = ny;
        this.blks.forEach((v, i) => {
            i <= 1 ? (v.y = this.py) : (v.y = this.py + 1);
        });
    }
}
class Tri extends Tetriminoe {
    constructor(x, y) {
        super(x, y, "purple");
        this.blks = [
            new Block(x, y + 1, BLOCKW, BLOCKH, this.color),
            new Block(x + 1, y + 1, BLOCKW, BLOCKH, this.color),
            new Block(x - 1, y + 1, BLOCKW, BLOCKH, this.color),
            new Block(x, y, BLOCKW, BLOCKH, this.color),
        ];
    }
    get x() {
        return this.px;
    }
    set x(nx) {
        this.px = nx;
        this.blks[0].x = nx;
        this.blks[1].x = nx + 1;
        this.blks[2].x = nx - 1;
        this.blks[3].x = nx;
    }
    get y() {
        return this.py;
    }
    set y(ny) {
        this.py = ny;
        this.blks[0].y = ny + 1;
        this.blks[1].y = ny + 1;
        this.blks[2].y = ny + 1;
        this.blks[3].y = ny;
    }
}
class LeftwardZigZag extends Tetriminoe {
    constructor(x, y) {
        super(x, y, "green");
        this.blks = [
            new Block(this.px - 1, this.py + 1, BLOCKW, BLOCKH, this.color),
            new Block(this.px, this.py + 1, BLOCKW, BLOCKH, this.color),
            new Block(this.px, this.py, BLOCKW, BLOCKH, this.color),
            new Block(this.px + 1, this.py, BLOCKW, BLOCKH, this.color),
        ];
    }
    get x() {
        return this.px;
    }
    set x(nx) {
        this.px = nx;
        this.blks[0].x = this.px - 1;
        this.blks[1].x = this.px;
        this.blks[2].x = this.px;
        this.blks[3].x = this.px + 1;
    }
    get y() {
        return this.py;
    }
    set y(ny) {
        this.py = ny;
        this.blks.forEach((v, i) => {
            i <= 1 ? (v.y = this.py + 1) : (v.y = this.py);
        });
    }
}
class RightwardZigZag extends Tetriminoe {
    constructor(x, y) {
        super(x, y, "red");
        this.blks = [
            new Block(this.px + 1, this.py + 1, BLOCKW, BLOCKH, this.color),
            new Block(this.px, this.py + 1, BLOCKW, BLOCKH, this.color),
            new Block(this.px, this.py, BLOCKW, BLOCKH, this.color),
            new Block(this.px - 1, this.py, BLOCKW, BLOCKH, this.color),
        ];
    }
    get x() {
        return this.px;
    }
    set x(nx) {
        this.px = nx;
        this.blks[0].x = this.px + 1;
        this.blks[1].x = this.px;
        this.blks[2].x = this.px;
        this.blks[3].x = this.px - 1;
    }
    get y() {
        return this.py;
    }
    set y(ny) {
        this.py = ny;
        this.blks.forEach((v, i) => {
            i <= 1 ? (v.y = this.py + 1) : (v.y = this.py);
        });
    }
}
class LeftwardL extends Tetriminoe {
    constructor(x, y) {
        super(x, y, "pink");
        this.blks = [
            new Block(this.px, this.py, BLOCKW, BLOCKH, this.color),
            new Block(this.px, this.py + 1, BLOCKW, BLOCKH, this.color),
            new Block(this.px, this.py + 2, BLOCKW, BLOCKH, this.color),
            new Block(this.px - 1, this.py + 2, BLOCKW, BLOCKH, this.color),
        ];
    }
    get x() {
        return this.px;
    }
    set x(nx) {
        this.px = nx;
        this.blks.forEach((v, i) => {
            i !== this.blks.length - 1 ? (v.x = this.px) : (v.x = this.px - 1);
        });
    }
    get y() {
        return this.py;
    }
    set y(ny) {
        this.py = ny;
        this.blks[0].y = this.py;
        this.blks[1].y = this.py + 1;
        this.blks[2].y = this.py + 2;
        this.blks[3].y = this.py + 2;
    }
}
class RightwardL extends Tetriminoe {
    constructor(x, y) {
        super(x, y, "orange");
        this.blks = [
            new Block(this.px, this.py, BLOCKW, BLOCKH, this.color),
            new Block(this.px, this.py + 1, BLOCKW, BLOCKH, this.color),
            new Block(this.px, this.py + 2, BLOCKW, BLOCKH, this.color),
            new Block(this.px + 1, this.py + 2, BLOCKW, BLOCKH, this.color),
        ];
    }
    get x() {
        return this.px;
    }
    set x(nx) {
        this.px = nx;
        this.blks.forEach((v, i) => {
            i === this.blks.length - 1 ? (v.x = this.px + 1) : (v.x = this.px);
        });
    }
    get y() {
        return this.py;
    }
    set y(ny) {
        this.py = ny;
        this.blks[0].y = this.py;
        this.blks[1].y = this.py + 1;
        this.blks[2].y = this.py + 2;
        this.blks[3].y = this.py + 2;
    }
}
export { Block, Straight, Square, Tri, LeftwardZigZag, RightwardZigZag, LeftwardL, RightwardL, Tetriminoe, };
