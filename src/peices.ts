import { BLOCKH, BLOCKW } from "./constants.js";
import { drawBlock, clearAbove, clearAhead, clearBehind } from "./drawUtils.js";

class Block {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;

  constructor(x: number, y: number, w: number, h: number, color: string) {
    this.color = color;
    this.h = h;
    this.w = w;
    this.x = x;
    this.y = y;
  }
}

class Tetriminoe {
  protected px: number;
  protected py: number;
  protected blks: Block[];
  color: string;
  protected constructor(x: number, y: number, color: string) {
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
  draw(ctx: CanvasRenderingContext2D) {
    this.blks.forEach((v) => drawBlock(v, ctx));
  }
  clearAbove(ctx: CanvasRenderingContext2D) {
    this.blks.forEach((v) => clearAbove(ctx, v));
  }

  clearRight(ctx: CanvasRenderingContext2D) {
    this.blks.forEach((v) => clearBehind(ctx, v));
  }
  clearLeft(ctx: CanvasRenderingContext2D) {
    this.blks.forEach((v) => clearAhead(ctx, v));
  }
  dumpBlocks() {
    return this.blks;
  }
}

class Straight extends Tetriminoe {
  constructor(x: number, y: number) {
    super(x, y, "blue");
    this.blks = [
      new Block(this.px, this.py, BLOCKW, BLOCKH, this.color),
      new Block(this.px, this.py + BLOCKH, BLOCKW, BLOCKH, this.color),
      new Block(this.px, this.py + BLOCKH * 2, BLOCKW, BLOCKH, this.color),
      new Block(this.px, this.py + BLOCKH * 3, BLOCKW, BLOCKH, this.color),
    ];
  }

  get x() {
    return this.px;
  }

  set x(nx) {
    this.px = nx;
    this.blks.forEach((v) => {
      v.x = this.px;
    });
  }

  get y() {
    return this.py;
  }

  set y(ny) {
    this.py = ny;
    this.blks.forEach((v, i) => {
      v.y = this.py + BLOCKH * i;
    });
  }
}

class Square extends Tetriminoe {
  constructor(x: number, y: number) {
    super(x, y, "yellow");
    this.blks = [
      new Block(this.px, this.py, BLOCKW, BLOCKH, this.color),
      new Block(this.px + BLOCKW, this.py, BLOCKW, BLOCKH, this.color),
      new Block(this.px, this.py + BLOCKH, BLOCKW, BLOCKH, this.color),
      new Block(this.px + BLOCKW, this.py + BLOCKH, BLOCKW, BLOCKH, this.color),
    ];
  }

  get x() {
    return this.px;
  }

  set x(nx) {
    this.px = nx;
    this.blks[0].x = this.px;
    this.blks[1].x = this.px + BLOCKW;
    this.blks[2].x = this.px;
    this.blks[3].x = this.px + BLOCKW;
  }

  get y() {
    return this.py;
  }

  set y(ny) {
    this.py = ny;
    this.blks.forEach((v, i) => {
      i <= 1 ? (v.y = this.py) : (v.y = this.py + BLOCKH);
    });
  }
}

class Tri extends Tetriminoe {
  constructor(x: number, y: number) {
    super(x, y, "purple");
    this.blks = [
      new Block(x, y + BLOCKH, BLOCKW, BLOCKH, this.color),
      new Block(x + BLOCKW, y + BLOCKH, BLOCKW, BLOCKH, this.color),
      new Block(x - BLOCKW, y + BLOCKH, BLOCKW, BLOCKH, this.color),
      new Block(x, y, BLOCKW, BLOCKH, this.color),
    ];
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
  constructor(x: number, y: number) {
    super(x, y, "green");
    this.blks = [
      new Block(this.px - BLOCKW, this.py + BLOCKH, BLOCKW, BLOCKH, this.color),
      new Block(this.px, this.py + BLOCKH, BLOCKW, BLOCKH, this.color),
      new Block(this.px, this.py, BLOCKW, BLOCKH, this.color),
      new Block(this.px + BLOCKW, this.py, BLOCKW, BLOCKH, this.color),
    ];
  }

  get x() {
    return this.px;
  }

  set x(nx) {
    this.px = nx;
    this.blks[0].x = this.px - BLOCKW;
    this.blks[1].x = this.px;
    this.blks[2].x = this.px;
    this.blks[3].x = this.px + BLOCKW;
  }

  get y() {
    return this.py;
  }

  set y(ny) {
    this.py = ny;
    this.blks.forEach((v, i) => {
      i <= 1 ? (v.y = this.py + BLOCKH) : (v.y = this.py);
    });
  }
}

class RightwardZigZag extends Tetriminoe {
  constructor(x: number, y: number) {
    super(x, y, "red");
    this.blks = [
      new Block(this.px + BLOCKW, this.py + BLOCKH, BLOCKW, BLOCKH, this.color),
      new Block(this.px, this.py + BLOCKH, BLOCKW, BLOCKH, this.color),
      new Block(this.px, this.py, BLOCKW, BLOCKH, this.color),
      new Block(this.px - BLOCKW, this.py, BLOCKW, BLOCKH, this.color),
    ];
  }

  get x() {
    return this.px;
  }

  set x(nx) {
    this.px = nx;
    this.blks[0].x = this.px + BLOCKW;
    this.blks[1].x = this.px;
    this.blks[2].x = this.px;
    this.blks[3].x = this.px - BLOCKW;
  }

  get y() {
    return this.py;
  }

  set y(ny) {
    this.py = ny;
    this.blks.forEach((v, i) => {
      i <= 1 ? (v.y = this.py + BLOCKH) : (v.y = this.py);
    });
  }
}

class LeftwardL extends Tetriminoe {
  constructor(x: number, y: number) {
    super(x, y, "pink");
    this.blks = [
      new Block(this.px, this.py, BLOCKW, BLOCKH, this.color),
      new Block(this.px, this.py + BLOCKH, BLOCKW, BLOCKH, this.color),
      new Block(this.px, this.py + BLOCKH * 2, BLOCKW, BLOCKH, this.color),
      new Block(
        this.px - BLOCKW,
        this.py + BLOCKH * 2,
        BLOCKW,
        BLOCKH,
        this.color
      ),
    ];
  }

  get x() {
    return this.px;
  }

  set x(nx) {
    this.px = nx;
    this.blks.forEach((v, i) => {
      i !== this.blks.length - 1 ? (v.x = this.px) : (v.x = this.px - BLOCKW);
    });
  }

  get y() {
    return this.py;
  }

  set y(ny) {
    this.py = ny;
    this.blks[0].y = this.py;
    this.blks[1].y = this.py + BLOCKH;
    this.blks[2].y = this.py + BLOCKH * 2;
    this.blks[3].y = this.py + BLOCKH * 2;
  }
}

class RightwardL extends Tetriminoe {
  constructor(x: number, y: number) {
    super(x, y, "orange");
    this.blks = [
      new Block(this.px, this.py, BLOCKW, BLOCKH, this.color),
      new Block(this.px, this.py + BLOCKH, BLOCKW, BLOCKH, this.color),
      new Block(this.px, this.py + BLOCKH * 2, BLOCKW, BLOCKH, this.color),
      new Block(
        this.px + BLOCKW,
        this.py + BLOCKH * 2,
        BLOCKW,
        BLOCKH,
        this.color
      ),
    ];
  }
  get x() {
    return this.px;
  }

  set x(nx) {
    this.px = nx;
    this.blks.forEach((v, i) => {
      i === this.blks.length - 1 ? (v.x = this.px + BLOCKW) : (v.x = this.px);
    });
  }

  get y() {
    return this.py;
  }

  set y(ny) {
    this.py = ny;
    this.blks[0].y = this.py;
    this.blks[1].y = this.py + BLOCKH;
    this.blks[2].y = this.py + BLOCKH * 2;
    this.blks[3].y = this.py + BLOCKH * 2;
  }
}
export {
  Block,
  Straight,
  Square,
  Tri,
  LeftwardZigZag,
  RightwardZigZag,
  LeftwardL,
  RightwardL,
  Tetriminoe,
};
