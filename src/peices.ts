import { BLOCKH, BLOCKW } from "./constants.js";
import { drawBlock } from "./drawUtils.js";

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
  color: string;
  protected constructor(x: number, y: number, color: string) {
    this.px = x;
    this.py = y;
    this.color = color;
  }
  draw(ctx: CanvasRenderingContext2D) {}
}

class Straight extends Tetriminoe {
  blk: Block;
  constructor(x: number, y: number, color: string) {
    super(x, y, color);
    this.blk = new Block(this.px, this.py, BLOCKW, BLOCKH * 4, this.color);
  }
  draw(ctx: CanvasRenderingContext2D): void {
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
  blk: Block;
  constructor(x: number, y: number, color: string) {
    super(x, y, color);
    this.blk = new Block(x, y, BLOCKW * 2, BLOCKH * 2, color);
  }

  draw(ctx: CanvasRenderingContext2D): void {
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
  blks: Block[];

  constructor(x: number, y: number, color: string) {
    super(x, y, color);
    this.blks = [
      new Block(x, y + BLOCKH, BLOCKW, BLOCKH, color),
      new Block(x + BLOCKW, y + BLOCKH, BLOCKW, BLOCKH, color),
      new Block(x - BLOCKW, y + BLOCKH, BLOCKW, BLOCKH, color),
      new Block(x, y, BLOCKW, BLOCKH, color),
    ];
  }

  draw(ctx: CanvasRenderingContext2D): void {
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
  blks: Block[];

  constructor(x: number, y: number, color: string) {
    super(x, y, color);
    this.blks = [
      new Block(this.px - BLOCKW, this.py + BLOCKH, BLOCKW, BLOCKH, this.color),
      new Block(this.px, this.py + BLOCKH, BLOCKW, BLOCKH, this.color),
      new Block(this.px, this.py, BLOCKW, BLOCKH, this.color),
      new Block(this.px + BLOCKW, this.py, BLOCKW, BLOCKH, this.color),
    ];
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.blks.forEach((v) => drawBlock(v, ctx));
  }
}

class RightwardZigZag extends Tetriminoe {
  blks: Block[];
  constructor(x: number, y: number, color: string) {
    super(x, y, color);
    this.blks = [
      new Block(this.px + BLOCKW, this.py + BLOCKH, BLOCKW, BLOCKH, this.color),
      new Block(this.px, this.py + BLOCKH, BLOCKW, BLOCKH, this.color),
      new Block(this.px, this.py, BLOCKW, BLOCKH, this.color),
      new Block(this.px - BLOCKW, this.py, BLOCKW, BLOCKH, this.color),
    ];
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.blks.forEach((v) => drawBlock(v, ctx));
  }
}

class LeftwardL extends Tetriminoe {
  blks: Block[];
  constructor(x: number, y: number, color: string) {
    super(x, y, color);
    this.blks = [
      new Block(this.px, this.py, BLOCKW, BLOCKH, color),
      new Block(this.px, this.py + BLOCKH, BLOCKW, BLOCKH, color),
      new Block(this.px, this.py + BLOCKH * 2, BLOCKW, BLOCKH, color),
      new Block(
        this.px - BLOCKW,
        this.py + BLOCKH * 2,
        BLOCKW,
        BLOCKH,
        this.color
      ),
    ];
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.blks.forEach((v) => drawBlock(v, ctx));
  }
}

class RightwardL extends Tetriminoe {
  blks: Block[];
  constructor(x: number, y: number, color: string) {
    super(x, y, color);
    this.blks = [
      new Block(this.px, this.py, BLOCKW, BLOCKH, color),
      new Block(this.px, this.py + BLOCKH, BLOCKW, BLOCKH, color),
      new Block(this.px, this.py + BLOCKH * 2, BLOCKW, BLOCKH, color),
      new Block(
        this.px + BLOCKW,
        this.py + BLOCKH * 2,
        BLOCKW,
        BLOCKH,
        this.color
      ),
    ];
  }
  draw(ctx: CanvasRenderingContext2D): void {
    this.blks.forEach((v) => drawBlock(v, ctx));
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
};
