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
    draw(ctx) { }
}
class Straight extends Tetriminoe {
    constructor(x, y, color) {
        super(x, y, color);
        this.blk = new Block(this.px, this.py, BLOCKW, BLOCKH * 4, this.color);
    }
    draw(ctx) {
        drawBlock(this.blk, ctx);
    }
    get x() {
        return this.blk.x;
    }
    set x(nx) {
        this.blk.x = nx;
    }
    get y() {
        return this.blk.y;
    }
    set y(ny) {
        this.blk.y = ny;
    }
}
class Square extends Tetriminoe {
    constructor(x, y, color) {
        super(x, y, color);
        this.blk = new Block(x, y, BLOCKW * 2, BLOCKH * 2, color);
    }
    draw(ctx) {
        drawBlock(this.blk, ctx);
    }
    get x() {
        return this.blk.x;
    }
    set x(nx) {
        this.blk.x = nx;
    }
    get y() {
        return this.blk.y;
    }
    set y(ny) {
        this.blk.y = ny;
    }
}
class Tri extends Tetriminoe {
    constructor(x, y, color) {
        super(x, y, color);
        this.blks = [
            new Block(x, y + BLOCKH, BLOCKW, BLOCKH, color),
            new Block(x + BLOCKW, y + BLOCKH, BLOCKW, BLOCKH, color),
            new Block(x - BLOCKW, y + BLOCKH, BLOCKW, BLOCKH, color),
            new Block(x, y, BLOCKW, BLOCKH, color),
        ];
    }
    draw(ctx) {
        this.blks.forEach((v) => drawBlock(v, ctx));
    }
    get x() {
        return this.px;
    }
    set x(nx) {
        this.px = nx;
        this.blks[0].x = nx;
        this.blks[1].x = nx + BLOCKW;
        this.blks[2].x = nx - BLOCKW;
        this.blks[3].x = nx;
    }
    get y() {
        return this.py;
    }
    set y(ny) {
        this.py = ny;
        this.blks[0].y = ny + BLOCKH;
        this.blks[1].y = ny + BLOCKH;
        this.blks[2].y = ny + BLOCKH;
        this.blks[3].y = ny;
    }
}
class LeftwardZigZag extends Tetriminoe {
    constructor(x, y, color) {
        super(x, y, color);
        this.blks = [
            new Block(this.px - BLOCKW, this.py + BLOCKH, BLOCKW, BLOCKH, this.color),
            new Block(this.px, this.py + BLOCKH, BLOCKW, BLOCKH, this.color),
            new Block(this.px, this.py, BLOCKW, BLOCKH, this.color),
            new Block(this.px + BLOCKW, this.py, BLOCKW, BLOCKH, this.color),
        ];
    }
    draw(ctx) {
        this.blks.forEach((v) => drawBlock(v, ctx));
    }
}
class RightwardZigZag extends Tetriminoe {
    constructor(x, y, color) {
        super(x, y, color);
        this.blks = [
            new Block(this.px + BLOCKW, this.py + BLOCKH, BLOCKW, BLOCKH, this.color),
            new Block(this.px, this.py + BLOCKH, BLOCKW, BLOCKH, this.color),
            new Block(this.px, this.py, BLOCKW, BLOCKH, this.color),
            new Block(this.px - BLOCKW, this.py, BLOCKW, BLOCKH, this.color),
        ];
    }
    draw(ctx) {
        this.blks.forEach((v) => drawBlock(v, ctx));
    }
}
class LeftwardL extends Tetriminoe {
    constructor(x, y, color) {
        super(x, y, color);
        this.blks = [
            new Block(this.px, this.py, BLOCKW, BLOCKH, color),
            new Block(this.px, this.py + BLOCKH, BLOCKW, BLOCKH, color),
            new Block(this.px, this.py + BLOCKH * 2, BLOCKW, BLOCKH, color),
            new Block(this.px - BLOCKW, this.py + BLOCKH * 2, BLOCKW, BLOCKH, this.color),
        ];
    }
    draw(ctx) {
        this.blks.forEach((v) => drawBlock(v, ctx));
    }
}
class RightwardL extends Tetriminoe {
    constructor(x, y, color) {
        super(x, y, color);
        this.blks = [
            new Block(this.px, this.py, BLOCKW, BLOCKH, color),
            new Block(this.px, this.py + BLOCKH, BLOCKW, BLOCKH, color),
            new Block(this.px, this.py + BLOCKH * 2, BLOCKW, BLOCKH, color),
            new Block(this.px + BLOCKW, this.py + BLOCKH * 2, BLOCKW, BLOCKH, this.color),
        ];
    }
    draw(ctx) {
        this.blks.forEach((v) => drawBlock(v, ctx));
    }
}
export { Block, Straight, Square, Tri, LeftwardZigZag, RightwardZigZag, LeftwardL, RightwardL, };
