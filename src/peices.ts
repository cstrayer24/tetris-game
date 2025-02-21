import { BLOCKH, BLOCKW, IGRIDH, IGRIDW } from "./constants.js";
import { drawBlock } from "./drawUtils.js";
import {
  createGrid,
  grid,
  scaleInternalToGameboardGrid,
  updateGrid,
  setBlockPosToInternalGridPos,
  swapRowsAndCols,
  reverseRows,
} from "./grid.js";

class Block {
  x: number;
  y: number;
  ix: number;
  iy: number;
  w: number;
  h: number;
  color: string;

  constructor(
    x: number,
    y: number,
    ix: number,
    iy: number,
    w: number,
    h: number,
    color: string
  ) {
    this.color = color;
    this.h = h;
    this.w = w;
    this.x = x;
    this.y = y;
    this.ix = ix;
    this.iy = iy;
  }
}

class Tetriminoe {
  protected px: number;
  protected py: number;
  protected internalGrid: grid;
  protected rotationPoint: number;
  blks: Block[];
  color: string;

  protected constructor(x: number, y: number, color: string) {
    this.px = x;
    this.py = y;
    this.color = color;
    this.internalGrid = createGrid(IGRIDW, IGRIDH);
    this.rotationPoint = 0;
  }

  get x() {
    return this.px;
  }

  set x(nx) {
    this.px = nx;
    this.blks.forEach((v, i) => {
      v.x = this.px;
    });
    scaleInternalToGameboardGrid(
      this.internalGrid,
      this.blks[this.rotationPoint]
    );
  }
  get y() {
    return this.py;
  }

  set y(ny) {
    this.py = ny;
    this.blks.forEach((v, i) => {
      v.y = this.py;
    });
    scaleInternalToGameboardGrid(
      this.internalGrid,
      this.blks[this.rotationPoint]
    );
  }
  draw(ctx: CanvasRenderingContext2D) {
    this.blks.forEach((blk) => drawBlock(blk, ctx));
  }

  rotate() {
    this.internalGrid = swapRowsAndCols(reverseRows(this.internalGrid));
    setBlockPosToInternalGridPos(this.internalGrid);
    scaleInternalToGameboardGrid(
      this.internalGrid,
      this.blks[this.rotationPoint]
    );
  }
}

class Straight extends Tetriminoe {
  constructor(x: number, y: number) {
    super(x, y, "blue");
    this.blks = [
      new Block(
        this.px,
        this.py,
        Math.floor(this.internalGrid.length / 2),
        0,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new Block(
        this.px,
        this.py,
        Math.floor(this.internalGrid.length / 2),
        1,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new Block(
        this.px,
        this.py,
        Math.floor(this.internalGrid.length / 2),
        2,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new Block(
        this.px,
        this.py,
        Math.floor(this.internalGrid.length / 2),
        3,
        BLOCKW,
        BLOCKH,
        this.color
      ),
    ];
    updateGrid(this.internalGrid, this, true);
    scaleInternalToGameboardGrid(this.internalGrid, this.blks[0]);
  }

  rotate(): void {
    this.internalGrid = swapRowsAndCols(reverseRows(this.internalGrid));
    setBlockPosToInternalGridPos(this.internalGrid);
    scaleInternalToGameboardGrid(this.internalGrid, this.blks[0]);
  }
}

class Square extends Tetriminoe {
  constructor(x: number, y: number) {
    super(x, y, "yellow");
    this.blks = [
      new Block(
        this.px,
        this.py,
        Math.floor(this.internalGrid[0].length / 2),
        Math.floor(this.internalGrid.length / 2),
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new Block(
        this.px,
        this.py,
        Math.floor(this.internalGrid[0].length / 2) + 1,
        Math.floor(this.internalGrid.length / 2),
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new Block(
        this.px,
        this.py,
        Math.floor(this.internalGrid[0].length / 2),
        Math.floor(this.internalGrid.length / 2) + 1,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new Block(
        this.px,
        this.py,
        Math.floor(this.internalGrid[0].length / 2) + 1,
        Math.floor(this.internalGrid.length / 2) + 1,
        BLOCKW,
        BLOCKH,
        this.color
      ),
    ];
    updateGrid(this.internalGrid, this, true);
    scaleInternalToGameboardGrid(this.internalGrid, this.blks[0]);
  }
  //the getters also need to be overloaded since the setters are
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
  rotate(): void {
    return;
  }
}

class Tri extends Tetriminoe {
  constructor(x: number, y: number) {
    super(x, y, "purple");
    this.blks = [
      new Block(
        x,
        y,
        Math.floor(this.internalGrid[0].length / 2),
        Math.floor(this.internalGrid.length / 2) + 1,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new Block(
        x,
        y,
        Math.floor(this.internalGrid[0].length / 2) + 1,
        Math.floor(this.internalGrid.length / 2) + 1,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new Block(
        x,
        y,
        Math.floor(this.internalGrid[0].length / 2) - 1,
        Math.floor(this.internalGrid.length / 2) + 1,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new Block(
        x,
        y,
        Math.floor(this.internalGrid[0].length / 2),
        Math.floor(this.internalGrid.length / 2),
        BLOCKW,
        BLOCKH,
        this.color
      ),
    ];
    this.rotationPoint = 3;
    updateGrid(this.internalGrid, this, true);
    scaleInternalToGameboardGrid(this.internalGrid, this.blks[3]);
  }
}

class LeftwardZigZag extends Tetriminoe {
  constructor(x: number, y: number) {
    super(x, y, "green");
    this.blks = [
      new Block(
        this.px,
        this.py,
        Math.floor(this.internalGrid[0].length / 2) - 1,
        Math.floor(this.internalGrid.length / 2) + 1,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new Block(
        this.px,
        this.py,
        Math.floor(this.internalGrid[0].length / 2),
        Math.floor(this.internalGrid.length / 2) + 1,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new Block(
        this.px,
        this.py,
        Math.floor(this.internalGrid[0].length / 2),
        Math.floor(this.internalGrid.length / 2),
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new Block(
        this.px,
        this.py,
        Math.floor(this.internalGrid[0].length / 2) + 1,
        Math.floor(this.internalGrid.length / 2),
        BLOCKW,
        BLOCKH,
        this.color
      ),
    ];
    this.rotationPoint = 2;
    updateGrid(this.internalGrid, this, true);
    scaleInternalToGameboardGrid(this.internalGrid, this.blks[2]);
  }
}

class RightwardZigZag extends Tetriminoe {
  constructor(x: number, y: number) {
    super(x, y, "red");
    this.blks = [
      new Block(
        this.px,
        this.py,
        Math.floor(this.internalGrid[0].length / 2) + 1,
        Math.floor(this.internalGrid.length / 2) + 1,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new Block(
        this.px,
        this.py,
        Math.floor(this.internalGrid[0].length / 2),
        Math.floor(this.internalGrid.length / 2) + 1,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new Block(
        this.px,
        this.py,
        Math.floor(this.internalGrid[0].length / 2),
        Math.floor(this.internalGrid.length / 2),
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new Block(
        this.px,
        this.py,
        Math.floor(this.internalGrid[0].length / 2) - 1,
        Math.floor(this.internalGrid.length / 2),
        BLOCKW,
        BLOCKH,
        this.color
      ),
    ];
    this.rotationPoint = 2;
    updateGrid(this.internalGrid, this, true);
    scaleInternalToGameboardGrid(this.internalGrid, this.blks[2]);
  }
}

class LeftwardL extends Tetriminoe {
  constructor(x: number, y: number) {
    super(x, y, "pink");
    this.blks = [
      new Block(
        this.px,
        this.py,
        Math.floor(this.internalGrid.length / 2),
        0,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new Block(
        this.px,
        this.py,
        Math.floor(this.internalGrid.length / 2),
        1,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new Block(
        this.px,
        this.py,
        Math.floor(this.internalGrid.length / 2),
        2,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new Block(
        this.px,
        this.py,
        Math.floor(this.internalGrid.length / 2) - 1,
        2,
        BLOCKW,
        BLOCKH,
        this.color
      ),
    ];
    updateGrid(this.internalGrid, this, true);
    scaleInternalToGameboardGrid(this.internalGrid, this.blks[0]);
  }
}

class RightwardL extends Tetriminoe {
  constructor(x: number, y: number) {
    super(x, y, "orange");
    this.blks = [
      new Block(
        this.px,
        this.py,
        Math.floor(this.internalGrid[0].length / 2),
        0,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new Block(
        this.px,
        this.py + 1,
        Math.floor(this.internalGrid[0].length / 2),
        1,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new Block(
        this.px,
        this.py + 2,
        Math.floor(this.internalGrid[0].length / 2),
        2,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new Block(
        this.px + 1,
        this.py + 2,
        Math.floor(this.internalGrid[0].length / 2) + 1,
        2,
        BLOCKW,
        BLOCKH,
        this.color
      ),
    ];
    updateGrid(this.internalGrid, this, true);
    scaleInternalToGameboardGrid(this.internalGrid, this.blks[0]);
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
