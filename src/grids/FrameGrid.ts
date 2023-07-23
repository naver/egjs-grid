/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import Grid from "../Grid";
import { PROPERTY_TYPE } from "../consts";
import { GridOptions, Properties, GridOutlines, GridRect } from "../types";
import { GetterSetter, range } from "../utils";
import { GridItem } from "../GridItem";


function getMaxPoint(outline: number[]) {
  let maxPoint = -Infinity;

  outline.forEach((point) => {
    if (isFinite(point)) {
      maxPoint = Math.max(maxPoint, point);
    }
  });
  return isFinite(maxPoint) ? maxPoint : 0;
}
function getMinPoint(outline: number[]) {
  let minPoint = Infinity;

  outline.forEach((point) => {
    if (isFinite(point)) {
      minPoint = Math.min(minPoint, point);
    }
  });
  return isFinite(minPoint) ? minPoint : 0;
}
function getOutlinePoint(startOutline: number[], frameOutline: number[], useFrameFill: boolean) {
  return getMaxPoint(startOutline)
    + getOutlineDist(startOutline, frameOutline, useFrameFill);
}

function getOutlineDist(startOutline: number[], endOutline: number[], useFrameFill: boolean) {
  const length = startOutline.length;

  if (!length) {
    return 0;
  }
  const minEndPoint = getMinPoint(endOutline);
  const maxStartPoint = getMaxPoint(startOutline);
  let frameDist = 0;

  if (!useFrameFill) {
    return 0;
  }


  for (let outlineIndex = 0; outlineIndex < length; ++outlineIndex) {
    const startPoint = startOutline[outlineIndex];
    const endPoint = endOutline[outlineIndex];

    if (!isFinite(startPoint) || !isFinite(endPoint)) {
      continue;
    }
    const startPos = startPoint - maxStartPoint;
    const endPos = endPoint - minEndPoint;


    // Fill empty block.
    frameDist = outlineIndex ? Math.max(frameDist, frameDist + startPos - endPos) : startPos - endPos;
  }

  return frameDist;
}
function fillOutlines(startOutline: number[], endOutline: number[], rect: {
  inlinePos: number;
  inlineSize: number;
  contentPos: number;
  contentSize: number;
}) {
  const {
    inlinePos,
    inlineSize,
    contentPos,
    contentSize,
  } = rect;
  for (
    let outlineIndex = inlinePos;
    outlineIndex < inlinePos + inlineSize;
    ++outlineIndex
  ) {
    startOutline[outlineIndex] = Math.min(startOutline[outlineIndex], contentPos);
    endOutline[outlineIndex] = Math.max(endOutline[outlineIndex], contentPos + contentSize);
  }
}
export interface FrameRect extends Required<GridRect> {
  type: any;
}
/**
 * @typedef
 * @memberof Grid.FrameGrid
 * @extends Grid.GridOptions
 */
export interface FrameGridOptions extends GridOptions {
  /**
   * The shape of the grid. You can set the shape and order of items with a 2d array ([contentPos][inlinePos]). You can place items as many times as you fill the array with numbers, and zeros and spaces are empty spaces. The order of the items is arranged in ascending order of the numeric values that fill the array.
   * <ko>Grid의 모양. 2d 배열([contentPos][inlinePos])로 아이템의 모양과 순서를 설정할 수 있다. 숫자로 배열을 채운만큼 아이템을 배치할 수 있으며 0과 공백은 빈 공간이다. 아이템들의 순서는 배열을 채운 숫자값의 오름차순대로 배치가 된다. (default: [])</ko>
   * @default []
   */
  frame?: number[][];
  /**
   * Make sure that the frame can be attached after the previous frame.
   * <ko> 다음 프레임이 전 프레임에 이어 붙일 수 있는지 있는지 확인한다.</ko>
   * @default true
   */
  useFrameFill?: boolean;
  /**
   * 1x1 rect size. If it is 0, it is determined by the number of columns in the frame.
   * <ko>1x1 직사각형 크기. 0이면 frame의 column의 개수에 의해 결정된다.</ko>
   * @default 0
   */
  rectSize?: number | { inlineSize: number, contentSize: number };
}

/**
 * 'Frame' is a printing term with the meaning that 'it fits in one row wide'. FrameGrid is a grid that the item is filled up on the basis of a line given a size.
 * @ko 'Frame'는 '1행의 너비에 맞게 꼭 들어찬'이라는 의미를 가진 인쇄 용어다. FrameGrid는 용어의 의미대로 너비가 주어진 사이즈를 기준으로 아이템이 가득 차도록 배치하는 Grid다.
 * @memberof Grid
 * @param {HTMLElement | string} container - A base element for a module <ko>모듈을 적용할 기준 엘리먼트</ko>
 * @param {Grid.FrameGrid.FrameGridOptions} options - The option object of the FrameGrid module <ko>FrameGrid 모듈의 옵션 객체</ko>
 */
@GetterSetter
export class FrameGrid extends Grid<FrameGridOptions> {
  public static propertyTypes = {
    ...Grid.propertyTypes,
    frame: PROPERTY_TYPE.RENDER_PROPERTY,
    useFrameFill: PROPERTY_TYPE.RENDER_PROPERTY,
    rectSize: PROPERTY_TYPE.RENDER_PROPERTY,
  };
  public static defaultOptions: Required<FrameGridOptions> = {
    ...Grid.defaultOptions,
    frame: [],
    rectSize: 0,
    useFrameFill: true,
  };

  public applyGrid(items: GridItem[], direction: "start" | "end", outline: number[]): GridOutlines {
    const frame = this._getFrame();
    const {
      inlineSize: frameInlineSize,
      contentSize: frameContentSize,
      rects: frameRects,
    } = frame;
    const {
      gap,
      useFrameFill,
    } = this.options;

    const {
      inlineSize: rectInlineSize,
      contentSize: rectContentSize,
    } = this.getRectSize(frameInlineSize);


    const itemsLength = items.length;

    if (!itemsLength || !frameInlineSize || !frameContentSize) {
      return { start: outline, end: outline };
    }
    const rectsLength = frameRects.length;
    let startOutline = range(frameInlineSize).map(() => Infinity);
    let endOutline = range(frameInlineSize).map(() => -Infinity);
    const frameOutline = frame.outline.map((point) => point * (rectContentSize + gap));

    for (let startIndex = 0; startIndex < itemsLength; startIndex += rectsLength) {
      // Compare group's startOutline and startOutline of rect
      const startPoint = getOutlinePoint(endOutline, frameOutline, useFrameFill);

      for (let rectIndex = 0; rectIndex < rectsLength && startIndex + rectIndex < itemsLength; ++rectIndex) {
        const item = items[startIndex + rectIndex];
        const {
          contentPos: frameRectContentPos,
          inlinePos: frameRectInlinePos,
          contentSize: frameRectContentSize,
          inlineSize: frameRectInlineSize,
        } = frameRects[rectIndex];
        const contentPos = startPoint + frameRectContentPos * (rectContentSize + gap);
        const inlinePos = frameRectInlinePos * (rectInlineSize + gap);
        const contentSize = frameRectContentSize * (rectContentSize + gap) - gap;
        const inlineSize = frameRectInlineSize * (rectInlineSize + gap) - gap;

        fillOutlines(startOutline, endOutline, {
          inlinePos: frameRectInlinePos,
          inlineSize: frameRectInlineSize,
          contentPos: contentPos,
          contentSize: contentSize + gap,
        });
        item.setCSSGridRect({
          inlinePos,
          contentPos,
          inlineSize,
          contentSize,
        });
      }
    }
    const isDirectionEnd = direction === "end";

    let gridOutline = outline.length ? outline : [0];

    if (gridOutline.length !== frameInlineSize) {
      const point = isDirectionEnd ? Math.max(...gridOutline) : Math.min(...gridOutline);

      gridOutline = range(frameInlineSize).map(() => point);
    }
    startOutline = startOutline.map((point) => isFinite(point) ? point : 0);
    endOutline = endOutline.map((point) => isFinite(point) ? point : 0);
    const outlineDist = isDirectionEnd
      ? getOutlinePoint(gridOutline, startOutline, useFrameFill)
      : getOutlinePoint(endOutline, gridOutline, useFrameFill);

    items.forEach((item) => {
      item.cssContentPos! += outlineDist;
    });

    return {
      start: startOutline.map((point) => point + outlineDist),
      end: endOutline.map((point) => point + outlineDist),
    };
  }
  public getComputedOutlineLength() {
    const frame = this.options.frame;

    return frame.length ? frame[0].length : 0;
  }
  public getComputedOutlineSize() {
    const {
      gap,
      rectSize: rectSizeOption,
    } = this.options;

    if (typeof rectSizeOption === "object") {
      return rectSizeOption.inlineSize;
    }
    return rectSizeOption || ((this.getContainerInlineSize()! + gap) / this.getComputedOutlineLength() - gap);
  }
  protected getRectSize(frameInlineSize: number) {
    const {
      gap,
      rectSize: rectSizeOption,
    } = this.options;

    if (typeof rectSizeOption === "object") {
      return rectSizeOption;
    }
    const rectSizeValue = rectSizeOption
      ? rectSizeOption
      : (this.getContainerInlineSize()! + gap) / frameInlineSize - gap;

    return { inlineSize: rectSizeValue, contentSize: rectSizeValue };
  }
  private _getFrame() {
    const frame = this.options.frame;
    const frameContentSize = frame.length;
    const frameInlineSize = frameContentSize ? frame[0].length : 0;
    const rects: FrameRect[] = [];
    const passMap: Record<string, boolean> = {};
    const startOutline = range(frameInlineSize).map(() => Infinity);
    const endOutline = range(frameInlineSize).map(() => -Infinity);

    for (let y1 = 0; y1 < frameContentSize; ++y1) {
      for (let x1 = 0; x1 < frameInlineSize; ++x1) {
        const type = frame[y1][x1];

        if (!type) {
          continue;
        }
        if (passMap[`${y1},${x1}`]) {
          continue;
        }
        const rect = this._findRect(passMap, type, y1, x1, frameInlineSize, frameContentSize);

        fillOutlines(startOutline, endOutline, rect);
        rects.push(rect);
      }
    }
    rects.sort((a, b) => (a.type < b.type ? -1 : 1));


    return {
      rects,
      inlineSize: frameInlineSize,
      contentSize: frameContentSize,
      outline: startOutline,
    };
  }
  private _findRect(
    passMap: Record<string, boolean>,
    type: number,
    y1: number,
    x1: number,
    frameInlineSize: number,
    frameContentSize: number,
  ) {
    const frame = this.options.frame;

    let contentSize = 1;
    let inlineSize = 1;

    // find rect
    for (let x2 = x1; x2 < frameInlineSize; ++x2) {
      if (frame[y1][x2] === type) {
        inlineSize = x2 - x1 + 1;
        continue;
      }
      break;
    }
    for (let y2 = y1; y2 < frameContentSize; ++y2) {
      if (frame[y2][x1] === type) {
        contentSize = y2 - y1 + 1;
        continue;
      }
      break;
    }

    // pass rect
    for (let y = y1; y < y1 + contentSize; ++y) {
      for (let x = x1; x < x1 + inlineSize; ++x) {
        passMap[`${y},${x}`] = true;
      }
    }

    const rect: FrameRect = {
      type,
      inlinePos: x1,
      contentPos: y1,
      inlineSize,
      contentSize,
    };
    return rect;
  }
}

export interface FrameGrid extends Properties<typeof FrameGrid> {
}


/**
 * The shape of the grid. You can set the shape and order of items with a 2d array ([contentPos][inlinePos]). You can place items as many times as you fill the array with numbers, and zeros and spaces are empty spaces. The order of the items is arranged in ascending order of the numeric values that fill the array.
 * @ko Grid의 모양. 2d 배열([contentPos][inlinePos])로 아이템의 모양과 순서를 설정할 수 있다. 숫자로 배열을 채운만큼 아이템을 배치할 수 있으며 0과 공백은 빈 공간이다. 아이템들의 순서는 배열을 채운 숫자값의 오름차순대로 배치가 된다.
 * @name Grid.FrameGrid#frame
 * @type {$ts:Grid.FrameGrid.FrameGridOptions["frame"]}
 * @default []
 * @example
 * ```js
 * import { FrameGrid } from "@egjs/grid";
 *
 * // Item 1 : 2 x 2
 * // Item 2 : 1 x 1
 * // Item 3 : 1 x 2
 * // Item 4 : 1 x 1
 * // Item 5 : 2 x 1
 * const grid = new FrameGrid(container, {
 *   frame: [
 *     [1, 1, 0, 0, 2, 3],
 *     [1, 1, 0, 4, 5, 5],
 *   ],
 * });
 *
 * // Item 1 : 2 x 2
 * // Item 2 : 2 x 2
 * grid.frame = [
 *   [1, 1, 0, 0, 2, 2],
 *   [1, 1, 0, 0, 2, 2],
 * ];
 * ```
 */

/**
 * Make sure that the frame can be attached after the previous frame.
 * @ko 다음 프레임이 전 프레임에 이어 붙일 수 있는지 있는지 확인한다.
 * @name Grid.FrameGrid#useFrameFill
 * @type {$ts:Grid.FrameGrid.FrameGridOptions["useFrameFill"]}
 * @default true
 * @example
 * ```js
 * import { FrameGrid } from "@egjs/grid";
 *
 * const grid = new FrameGrid(container, {
 *   useFrameFill: true,
 * });
 *
 * grid.useFrameFill = false;
 * ```
 */

/**
 * 1x1 rect size. If it is 0, it is determined by the number of columns in the frame. (default: 0)
 * @ko 1x1 직사각형 크기. 0이면 frame의 column의 개수에 의해 결정된다. (default: 0)
 * @name Grid.FrameGrid#rectSize
 * @type {$ts:Grid.FrameGrid.FrameGridOptions["rectSize"]}
 * @example
 * ```js
 * import { FrameGrid } from "@egjs/grid";
 *
 * const grid = new FrameGrid(container, {
 *   rectSize: 0,
 * });
 *
 * grid.rectSize = { inlineSize: 100, contentSize: 150 };
 * ```
 */
