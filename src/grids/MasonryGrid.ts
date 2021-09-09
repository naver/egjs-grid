/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import Grid from "../Grid";
import { PROPERTY_TYPE, UPDATE_STATE } from "../consts";
import { GridOptions, Properties, GridOutlines, GridAlign } from "../types";
import { range, GetterSetter } from "../utils";
import { GridItem } from "../GridItem";


function getColumnPoint(
  outline: number[],
  columnIndex: number,
  columnCount: number,
  pointCaculationName: "max" | "min",
) {
  return Math[pointCaculationName](...outline.slice(columnIndex, columnIndex + columnCount));
}

function getColumnIndex(outline: number[], columnCount: number, nearestCalculationName: "max" | "min") {
  const length = outline.length - columnCount + 1;
  const pointCaculationName = nearestCalculationName === "max" ? "min" : "max";
  const indexCaculationName = nearestCalculationName === "max" ? "lastIndexOf" : "indexOf";
  const points = range(length).map((index) => {
    return getColumnPoint(outline, index, columnCount, pointCaculationName);
  });

  return points[indexCaculationName](Math[nearestCalculationName](...points));
}

/**
 * @typedef
 * @memberof Grid.MasonryGrid
 * @extends Grid.GridOptions
 * @property - The number of columns. If the number of columns is 0, it is automatically calculated according to the size of the container. <ko>열의 개수. 열의 개수가 0이라면, 컨테이너의 사이즈에 의해 계산이 된다. (default: 0) </ko>
 * @property - The size of the columns. If it is 0, it is calculated as the size of the first item in items. (default: 0) <ko> 열의 사이즈. 만약 열의 사이즈가 0이면, 아이템들의 첫번째 아이템의 사이즈로 계산이 된다. (default: 0) </ko>
 * @property - The size ratio(inlineSize / contentSize) of the columns. 0 is not set. (default: 0) <ko>열의 사이즈 비율(inlineSize / contentSize). 0은 미설정이다. </ko>
 * @property - Align of the position of the items. If you want to use `stretch`, be sure to set `column` or `columnSize` option. ("start", "center", "end", "justify", "stretch") (default: "justify") <ko>아이템들의 위치의 정렬. `stretch`를 사용하고 싶다면 `column` 또는 `columnSize` 옵션을 설정해라.  ("start", "center", "end", "justify", "stretch") (default: "justify")</ko>
 */
export interface MasonryGridOptions extends GridOptions {
  column?: number;
  columnSize?: number;
  columnSizeRatio?: number;
  align?: GridAlign;
}

/**
 * MasonryGrid is a grid that stacks items with the same width as a stack of bricks. Adjust the width of all images to the same size, find the lowest height column, and insert a new item.
 *
 * @ko MasonryGrid는 벽돌을 쌓아 올린 모양처럼 동일한 너비를 가진 아이템를 쌓는 레이아웃이다. 모든 이미지의 너비를 동일한 크기로 조정하고, 가장 높이가 낮은 열을 찾아 새로운 이미지를 삽입한다. 따라서 배치된 아이템 사이에 빈 공간이 생기지는 않지만 배치된 레이아웃의 아래쪽은 울퉁불퉁해진다.
 * @memberof Grid
 * @param {HTMLElement | string} container - A base element for a module <ko>모듈을 적용할 기준 엘리먼트</ko>
 * @param {Grid.MasonryGrid.MasonryGridOptions} options - The option object of the MasonryGrid module <ko>MasonryGrid 모듈의 옵션 객체</ko>
 */
@GetterSetter
export class MasonryGrid extends Grid<MasonryGridOptions> {
  public static propertyTypes = {
    ...Grid.propertyTypes,
    column: PROPERTY_TYPE.RENDER_PROPERTY,
    columnSize: PROPERTY_TYPE.RENDER_PROPERTY,
    columnSizeRatio: PROPERTY_TYPE.RENDER_PROPERTY,
    align: PROPERTY_TYPE.RENDER_PROPERTY,
  };
  public static defaultOptions: Required<MasonryGridOptions> = {
    ...Grid.defaultOptions,
    align: "justify",
    column: 0,
    columnSize: 0,
    columnSizeRatio: 0,
  };

  private _columnSize = 0;
  private _column = 1;

  public applyGrid(items: GridItem[], direction: "start" | "end", outline: number[]): GridOutlines {
    this._calculateColumnSize(items);
    this._calculateColumn(items);

    const column = this._column;
    const columnSize = this._columnSize;
    const {
      gap,
      align,
      columnSizeRatio,
      columnSize: columnSizeOption,
    } = this.options;
    const outlineLength = outline.length;
    const itemsLength = items.length;
    const alignPoses = this._getAlignPoses();
    const isEndDirection = direction === "end";
    const nearestCalculationName = isEndDirection ? "min" : "max";
    const pointCalculationName = isEndDirection ? "max" : "min";
    let startOutline = [0];

    if (outlineLength === column) {
      startOutline = outline.slice();
    } else {
      const point = outlineLength ? Math[pointCalculationName](...outline) : 0;

      startOutline = range(column).map(() => point);
    }
    const endOutline = startOutline.slice();
    const columnDist = column > 1 ? alignPoses[1] - alignPoses[0] : 0;
    const isStretch = align === "stretch";

    for (let i = 0; i < itemsLength; ++i) {
      const item = items[isEndDirection ? i : itemsLength - 1 - i];
      const columnAttribute = parseInt(item.attributes.column || "1", 10);
      const maxColumnAttribute = parseInt(item.attributes.maxColumn || "1", 10);
      let inlineSize = item.inlineSize;
      let contentSize = item.contentSize;
      let columnCount = Math.min(column, columnAttribute || Math.max(1, Math.ceil((inlineSize + gap) / columnDist)));
      const maxColumnCount = Math.min(column, Math.max(columnCount, maxColumnAttribute));
      let columnIndex = getColumnIndex(endOutline, columnCount, nearestCalculationName);
      let contentPos = getColumnPoint(endOutline, columnIndex, columnCount, pointCalculationName);

      while (columnCount < maxColumnCount) {
        const nextEndColumnIndex = columnIndex + columnCount;
        const nextColumnIndex = columnIndex - 1;

        if (isEndDirection && (nextEndColumnIndex >= column || endOutline[nextEndColumnIndex] > contentPos)) {
          break;
        }
        if (!isEndDirection && (nextColumnIndex < 0 || endOutline[nextColumnIndex]) < contentPos) {
          break;
        }
        if (!isEndDirection) {
          --columnIndex;
        }
        ++columnCount;
      }

      columnIndex = Math.max(0, columnIndex);
      columnCount = Math.min(column - columnIndex, columnCount);

      if (columnAttribute > 0 && (columnCount > 1 || isStretch || columnSizeOption)) {
        inlineSize = (columnCount - 1) * columnDist + columnSize;
        item.cssInlineSize = inlineSize;
      }
      if (columnSizeRatio > 0) {
        contentSize = inlineSize / columnSizeRatio;
        item.cssContentSize = contentSize;
      }
      const inlinePos = alignPoses[columnIndex];
      contentPos = isEndDirection ? contentPos : contentPos - gap - contentSize;

      item.cssInlinePos = inlinePos;
      item.cssContentPos = contentPos;
      const nextOutlinePoint = isEndDirection ? contentPos + contentSize + gap : contentPos;

      range(columnCount).forEach((indexOffset) => {
        endOutline[columnIndex + indexOffset] = nextOutlinePoint;
      });
    }

    // if end items, startOutline is low, endOutline is high
    // if start items, startOutline is high, endOutline is low
    return {
      start: isEndDirection ? startOutline : endOutline,
      end: isEndDirection ? endOutline : startOutline,
    };
  }
  private _calculateColumnSize(items: GridItem[]) {
    const {
      columnSize: columnSizeOption,
      gap,
      align,
    } = this.options;

    if (align === "stretch") {
      let column = this.column;

      if (columnSizeOption) {
        column = Math.max(1, Math.floor((this.getContainerInlineSize() + gap) / (columnSizeOption + gap)));
      }
      this._columnSize = (this.getContainerInlineSize() + gap) / (column || 1) - gap;
    } else if (columnSizeOption) {
      this._columnSize = columnSizeOption;
    } else if (items.length) {
      let checkedItem = items[0];

      for (const item of items) {
        const attributes = item.attributes;
        if (
          item.updateState !== UPDATE_STATE.UPDATED
          || !item.inlineSize
          || attributes.column
          || attributes.maxColumnCount
        ) {
          continue;
        }
        checkedItem = item;
        break;
      }
      const inlineSize = checkedItem.inlineSize || 0;

      this._columnSize = inlineSize;
      return inlineSize;
    }
    this._columnSize = this._columnSize || 0;

    return this._columnSize;
  }
  private _calculateColumn(items: GridItem[]) {
    const {
      gap,
      column: columnOption,
    } = this.options;
    const columnSize = this._columnSize;
    let column = 1;

    if (columnOption) {
      column = columnOption;
    } else if (!columnSize) {
      column = 1;
    } else {
      column = Math.min(
        items.length,
        Math.max(1, Math.floor((this.getContainerInlineSize() + gap) / (columnSize + gap))),
      );
    }
    this._column = column;
    return column;
  }
  private _getAlignPoses() {
    const columnSize = this._columnSize;
    const column = this._column;
    const {
      align,
      gap,
    } = this.options;
    const containerSize = this.getContainerInlineSize();
    const indexes = range(column);

    let offset = 0;
    let dist = 0;

    if (align === "justify" || align === "stretch") {
      const countDist = column - 1;

      dist = countDist ? Math.max((containerSize - columnSize) / countDist, columnSize + gap) : 0;
      offset = Math.min(0, containerSize / 2 - (countDist * dist + columnSize) / 2);
    } else {
      dist = columnSize + gap;
      const totalColumnSize = (column - 1) * dist + columnSize;

      if (align === "center") {
        offset = (containerSize - totalColumnSize) / 2;
      } else if (align === "end") {
        offset = containerSize - totalColumnSize;
      }
    }
    return indexes.map((i) => {
      return offset + i * dist;
    });
  }
}

export interface MasonryGrid extends Properties<typeof MasonryGrid> {
}


/**
 * Align of the position of the items. If you want to use `stretch`, be sure to set `column` or `columnSize` option. ("start", "center", "end", "justify", "stretch") (default: "justify")
 * @ko 아이템들의 위치의 정렬. `stretch`를 사용하고 싶다면 `column` 또는 `columnSize` 옵션을 설정해라.  ("start", "center", "end", "justify", "stretch") (default: "justify")
 * @name Grid.MasonryGrid#align
 * @type {$ts:Grid.MasonryGrid.MasonryGridOptions["align"]}
 * @example
 * ```js
 * import { MasonryGrid } from "@egjs/grid";
 *
 * const grid = new MasonryGrid(container, {
 *   align: "start",
 * });
 *
 * grid.align = "justify";
 * ```
 */


/**
 * The number of columns. If the number of columns is 0, it is automatically calculated according to the size of the container.
 * @ko 열의 개수. 열의 개수가 0이라면, 컨테이너의 사이즈에 의해 계산이 된다. (default: 0)
 * @name Grid.MasonryGrid#column
 * @type {$ts:Grid.MasonryGrid.MasonryGridOptions["column"]}
 * @example
 * ```js
 * import { MasonryGrid } from "@egjs/grid";
 *
 * const grid = new MasonryGrid(container, {
 *   column: 0,
 * });
 *
 * grid.column = 4;
 * ```
 */


/**
 * The size of the columns. If it is 0, it is calculated as the size of the first item in items. (default: 0)
 * @ko 열의 사이즈. 만약 열의 사이즈가 0이면, 아이템들의 첫번째 아이템의 사이즈로 계산이 된다. (default: 0)
 * @name Grid.MasonryGrid#columnSize
 * @type {$ts:Grid.MasonryGrid.MasonryGridOptions["columnSize"]}
 * @example
 * ```js
 * import { MasonryGrid } from "@egjs/grid";
 *
 * const grid = new MasonryGrid(container, {
 *   columnSize: 0,
 * });
 *
 * grid.columnSize = 200;
 * ```
 */


/**
 * The size ratio(inlineSize / contentSize) of the columns. 0 is not set. (default: 0)
 * @ko 열의 사이즈 비율(inlineSize / contentSize). 0은 미설정이다.
 * @name Grid.MasonryGrid#columnSizeRatio
 * @type {$ts:Grid.MasonryGrid.MasonryGridOptions["columnSizeRatio"]}
 * @example
 * ```js
 * import { MasonryGrid } from "@egjs/grid";
 *
 * const grid = new MasonryGrid(container, {
 *   columnSizeRatio: 0,
 * });
 *
 * grid.columnSizeRatio = 0.5;
 * ```
 */
