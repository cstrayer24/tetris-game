import {
  BLOCKH,
  BLOCKW,
  colorTextureLUT,
  IGRIDH,
  IGRIDW,
  TEXTUREWRAPPERID,
} from "./constants.js";
import { drawBlock } from "./drawUtils.js";
import {
  createGrid,
  grid,
  scaleInternalToGameboardGrid,
  updateGrid,
  setBlockPosToInternalGridPos,
  rotateGrid,
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
class TexturedBlock extends Block {
  texturePath: string;
  // imgel: CanvasImageSource;
  constructor(
    x: number,
    y: number,
    ix: number,
    iy: number,
    width: number,
    height: number,
    color: string
  ) {
    super(x, y, ix, iy, width, height, color);
    if (Object.hasOwn(colorTextureLUT, color)) {
      this.texturePath = colorTextureLUT[color];
    }

    const textureContainer = document.querySelector(`#${TEXTUREWRAPPERID}`);
    if (textureContainer === null) {
      const wrapperEl = document.createElement("div");
      wrapperEl.id = `#${TEXTUREWRAPPERID}`;
      wrapperEl.style.display = "none";
      document.body.appendChild(wrapperEl);
    }
    const imgel = document.querySelector(
      `#texture_${color}`
    ) as HTMLImageElement;

    if (imgel === null) {
      const newImg = new Image();
      newImg.id = `texture_${color}`;
      newImg.src = this.texturePath;
      textureContainer.appendChild(newImg);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const imgel = document.querySelector(
      `#texture_${this.color}`
    ) as HTMLImageElement;
    ctx.drawImage(imgel, this.x * BLOCKW, this.y * BLOCKH, BLOCKW, BLOCKH);
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

  rotate(outerGrid: grid) {
    const blksClone = structuredClone(this.blks);
    console.log(blksClone);
    let IgridClone = createGrid(IGRIDW, IGRIDH);
    blksClone.forEach((blk) => {
      IgridClone[blk.iy][blk.ix] = blk;
    });

    IgridClone = rotateGrid(IgridClone);
    setBlockPosToInternalGridPos(IgridClone);
    scaleInternalToGameboardGrid(IgridClone, blksClone[this.rotationPoint]);

    for (const blk of blksClone) {
      if (
        blk.x >= outerGrid[0].length ||
        blk.x < 0 ||
        blk.y >= outerGrid.length ||
        blk.y < 0
      ) {
        continue;
      }

      if (
        outerGrid[blk.y][blk.x] !== undefined &&
        !this.blks.includes(outerGrid[blk.y][blk.x])
      ) {
        return;
      }
    }
    for (let i = 0; i < this.blks.length; i++) {
      const currBlk = this.blks[i];
      outerGrid[currBlk.y][currBlk.x] = undefined;
      currBlk.ix = blksClone[i].ix;
      currBlk.iy = blksClone[i].iy;
      currBlk.x = blksClone[i].x;
      currBlk.y = blksClone[i].y;
      this.internalGrid[currBlk.iy][currBlk.ix] = currBlk;
    }
    // this.blks = blksClone;
    // this.internalGrid = IgridClone;
  }
}

class Straight extends Tetriminoe {
  constructor(x: number, y: number) {
    super(x, y, "blue");
    this.blks = [
      new TexturedBlock(
        this.px,
        this.py,
        Math.floor(this.internalGrid.length / 2),
        0,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new TexturedBlock(
        this.px,
        this.py,
        Math.floor(this.internalGrid.length / 2),
        1,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new TexturedBlock(
        this.px,
        this.py,
        Math.floor(this.internalGrid.length / 2),
        2,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new TexturedBlock(
        this.px,
        this.py,
        Math.floor(this.internalGrid.length / 2),
        3,
        BLOCKW,
        BLOCKH,
        this.color
      ),
    ];
    this.rotationPoint = 1;
    updateGrid(this.internalGrid, this, true);
    scaleInternalToGameboardGrid(this.internalGrid, this.blks[0]);
  }
}

class Square extends Tetriminoe {
  constructor(x: number, y: number) {
    super(x, y, "yellow");
    this.blks = [
      new TexturedBlock(
        this.px,
        this.py,
        Math.floor(this.internalGrid[0].length / 2),
        Math.floor(this.internalGrid.length / 2),
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new TexturedBlock(
        this.px,
        this.py,
        Math.floor(this.internalGrid[0].length / 2) + 1,
        Math.floor(this.internalGrid.length / 2),
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new TexturedBlock(
        this.px,
        this.py,
        Math.floor(this.internalGrid[0].length / 2),
        Math.floor(this.internalGrid.length / 2) + 1,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new TexturedBlock(
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
      new TexturedBlock(
        x,
        y,
        Math.floor(this.internalGrid[0].length / 2),
        Math.floor(this.internalGrid.length / 2) + 1,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new TexturedBlock(
        x,
        y,
        Math.floor(this.internalGrid[0].length / 2) + 1,
        Math.floor(this.internalGrid.length / 2) + 1,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new TexturedBlock(
        x,
        y,
        Math.floor(this.internalGrid[0].length / 2) - 1,
        Math.floor(this.internalGrid.length / 2) + 1,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new TexturedBlock(
        x,
        y,
        Math.floor(this.internalGrid[0].length / 2),
        Math.floor(this.internalGrid.length / 2),
        BLOCKW,
        BLOCKH,
        this.color
      ),
    ];
    this.rotationPoint = 0;
    updateGrid(this.internalGrid, this, true);
    scaleInternalToGameboardGrid(this.internalGrid, this.blks[3]);
  }
}

class LeftwardZigZag extends Tetriminoe {
  constructor(x: number, y: number) {
    super(x, y, "green");
    this.blks = [
      new TexturedBlock(
        this.px,
        this.py,
        Math.floor(this.internalGrid[0].length / 2) - 1,
        Math.floor(this.internalGrid.length / 2) + 1,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new TexturedBlock(
        this.px,
        this.py,
        Math.floor(this.internalGrid[0].length / 2),
        Math.floor(this.internalGrid.length / 2) + 1,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new TexturedBlock(
        this.px,
        this.py,
        Math.floor(this.internalGrid[0].length / 2),
        Math.floor(this.internalGrid.length / 2),
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new TexturedBlock(
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
      new TexturedBlock(
        this.px,
        this.py,
        Math.floor(this.internalGrid[0].length / 2) + 1,
        Math.floor(this.internalGrid.length / 2) + 1,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new TexturedBlock(
        this.px,
        this.py,
        Math.floor(this.internalGrid[0].length / 2),
        Math.floor(this.internalGrid.length / 2) + 1,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new TexturedBlock(
        this.px,
        this.py,
        Math.floor(this.internalGrid[0].length / 2),
        Math.floor(this.internalGrid.length / 2),
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new TexturedBlock(
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
      new TexturedBlock(
        this.px,
        this.py,
        Math.floor(this.internalGrid.length / 2),
        0,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new TexturedBlock(
        this.px,
        this.py,
        Math.floor(this.internalGrid.length / 2),
        1,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new TexturedBlock(
        this.px,
        this.py,
        Math.floor(this.internalGrid.length / 2),
        2,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new TexturedBlock(
        this.px,
        this.py,
        Math.floor(this.internalGrid.length / 2) - 1,
        2,
        BLOCKW,
        BLOCKH,
        this.color
      ),
    ];
    this.rotationPoint = 1;
    updateGrid(this.internalGrid, this, true);
    scaleInternalToGameboardGrid(this.internalGrid, this.blks[0]);
  }
}

class RightwardL extends Tetriminoe {
  constructor(x: number, y: number) {
    super(x, y, "orange");
    this.blks = [
      new TexturedBlock(
        this.px,
        this.py,
        Math.floor(this.internalGrid[0].length / 2),
        0,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new TexturedBlock(
        this.px,
        this.py + 1,
        Math.floor(this.internalGrid[0].length / 2),
        1,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new TexturedBlock(
        this.px,
        this.py + 2,
        Math.floor(this.internalGrid[0].length / 2),
        2,
        BLOCKW,
        BLOCKH,
        this.color
      ),
      new TexturedBlock(
        this.px + 1,
        this.py + 2,
        Math.floor(this.internalGrid[0].length / 2) + 1,
        2,
        BLOCKW,
        BLOCKH,
        this.color
      ),
    ];
    this.rotationPoint = 1;
    updateGrid(this.internalGrid, this, true);
    scaleInternalToGameboardGrid(this.internalGrid, this.blks[0]);
  }
}
export {
  Block,
  TexturedBlock,
  Straight,
  Square,
  Tri,
  LeftwardZigZag,
  RightwardZigZag,
  LeftwardL,
  RightwardL,
  Tetriminoe,
};
