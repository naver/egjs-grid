/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import Grid from "../Grid";
import { MOUNT_STATE, PROPERTY_TYPE } from "../consts";
import { GridOptions, Properties, GridOutlines } from "../types";
import { getRangeCost, GetterSetter, isObject } from "../utils";
import { find_path } from "./lib/dijkstra";
import { GridItem } from "../GridItem";


interface Link {
  path: number[];
  cost: number;
  length: number;
  currentNode: number;
  isOver?: boolean;
}

function splitItems(items: GridItem[], path: string[]) {
  const length = path.length;
  const groups: GridItem[][] = [];

  for (let i = 0; i < length - 1; ++i) {
    const path1 = parseInt(path[i], 10);
    const path2 = parseInt(path[i + 1], 10);

    groups.push(items.slice(path1, path2));
  }
  return groups;
}
function getExpectedColumnSize(item: GridItem, rowSize: number) {
  const inlineSize = item.orgInlineSize;
  const contentSize = item.orgContentSize;

  if (!inlineSize || !contentSize) {
    return rowSize;
  }
  const inlineOffset = parseFloat(item.gridData.inlineOffset) || 0;
  const contentOffset = parseFloat(item.gridData.contentOffset) || 0;
  const ratio = contentSize <= contentOffset ? 1 : (inlineSize - inlineOffset) / (contentSize - contentOffset);

  return ratio * (rowSize - contentOffset) + inlineOffset;
}

/**
 * @typedef
 * @memberof Grid.JustifiedGrid
 * @extends Grid.GridOptions
 */
export interface JustifiedGridOptions extends GridOptions {
  /**
   * The minimum and maximum number of items per line.
   * <ko> 한 줄에 들어가는 아이템의 최소, 최대 개수.</ko>
   * @default [1, 8]
   */
  columnRange?: number | number[];
  /**
   * The minimum and maximum number of rows in a group, 0 is not set.
   * <ko> 한 그룹에 들어가는 행의 최소, 최대 개수, 0은 미설정이다.</ko>
   * @default 0
   */
  rowRange?: number | number[];
  /**
   * The minimum and maximum size by which the item is adjusted. If it is not calculated, it may deviate from the minimum and maximum sizes.
   * <ko>아이템이 조정되는 최소, 최대 사이즈. 계산이 되지 않는 경우 최소, 최대 사이즈를 벗어날 수 있다.</ko>
   * @default [0, Infinity]
   */
  sizeRange?: number | number[];
  /**
   * Maximum number of rows to be counted for container size. You can hide it on the screen by setting overflow: hidden. -1 is not set.
   * <ko>컨테이너 크기에 계산될 최대 row 개수. overflow: hidden을 설정하면 화면에 가릴 수 있다. -1은 미설정이다.</ko>
   * @default -1
   */
  displayedRow?: number;
  /**
   * Whether to crop when the row size is out of sizeRange. If set to true, this ratio can be broken.
   * <ko>row사이즈가 sizeRange에 벗어나면 크롭할지 여부. true로 설정하면 비율이 깨질 수 있다.</ko>
   * @default false
   */
  isCroppedSize?: boolean;
}

/**
 * 'justified' is a printing term with the meaning that 'it fits in one row wide'. JustifiedGrid is a grid that the item is filled up on the basis of a line given a size.
 * If 'data-grid-inline-offset' or 'data-grid-content-offset' are set for item element, the ratio is maintained except for the offset value.
 * If 'data-grid-maintained-target' is set for an element whose ratio is to be maintained, the item is rendered while maintaining the ratio of the element.
 * @ko 'justified'는 '1행의 너비에 맞게 꼭 들어찬'이라는 의미를 가진 인쇄 용어다. JustifiedGrid는 용어의 의미대로 너비가 주어진 사이즈를 기준으로 아이템가 가득 차도록 배치하는 Grid다.
 * 아이템 엘리먼트에 'data-grid-inline-offset' 또는 'data-grid-content-offset'를 설정하면 offset 값을 제외하고 비율을 유지한다.
 * 비율을 유지하고 싶은 엘리먼트에 'data-grid-maintained-target'을 설정한다면 해당 엘리먼트의 비율을 유지하면서 아이템이 렌더링이 된다.
 * @memberof Grid
 * @param {HTMLElement | string} container - A base element for a module <ko>모듈을 적용할 기준 엘리먼트</ko>
 * @param {Grid.JustifiedGrid.JustifiedGridOptions} options - The option object of the JustifiedGrid module <ko>JustifiedGrid 모듈의 옵션 객체</ko>
 */
@GetterSetter
export class JustifiedGrid extends Grid<JustifiedGridOptions> {
  public static propertyTypes = {
    ...Grid.propertyTypes,
    columnRange: PROPERTY_TYPE.RENDER_PROPERTY,
    rowRange: PROPERTY_TYPE.RENDER_PROPERTY,
    sizeRange: PROPERTY_TYPE.RENDER_PROPERTY,
    isCroppedSize: PROPERTY_TYPE.RENDER_PROPERTY,
    displayedRow: PROPERTY_TYPE.RENDER_PROPERTY,
  };
  public static defaultOptions: Required<JustifiedGridOptions> = {
    ...Grid.defaultOptions,
    columnRange: [1, 8],
    rowRange: 0,
    sizeRange: [0, Infinity],
    displayedRow: -1,
    isCroppedSize: false,
  };
  public applyGrid(items: GridItem[], direction: "start" | "end", outline: number[]): GridOutlines {
    const {
      attributePrefix,
      horizontal,
    } = this.options;

    items.forEach((item) => {
      if (!item.isUpdating) {
        return;
      }
      const element = item.element;
      const attributes = item.attributes;
      const gridData = item.gridData;
      let inlineOffset = parseFloat(attributes.inlineOffset) || gridData.inlineOffset || 0;
      let contentOffset = parseFloat(attributes.contentOffset) || gridData.contentOffset | 0;

      if (
        element && !("inlineOffset" in attributes) && !("contentOffset" in attributes)
        && item.mountState === MOUNT_STATE.MOUNTED
      ) {
        const maintainedTarget = element.querySelector(`[${attributePrefix}maintained-target]`);

        if (maintainedTarget) {
          const widthOffset = element.offsetWidth - element.clientWidth
            + element.scrollWidth - maintainedTarget.clientWidth;
          const heightOffset = element.offsetHeight - element.clientHeight
            + element.scrollHeight - maintainedTarget.clientHeight;

          if (horizontal) {
            inlineOffset = heightOffset;
            contentOffset = widthOffset;
          } else {
            inlineOffset = widthOffset;
            contentOffset = heightOffset;
          }
        }
      }
      gridData.inlineOffset = inlineOffset;
      gridData.contentOffset = contentOffset;
    });
    const rowRange = this.options.rowRange;
    let path: string[] = [];

    if (items.length) {
      path = rowRange ? this._getRowPath(items) : this._getPath(items);
    }

    return this._setStyle(items, path, outline, direction === "end");
  }
  private _getRowPath(items: GridItem[]) {
    const columnRange = this._getColumnRange();
    const rowRange = this._getRowRange();

    const pathLink = this._getRowLink(items, {
      path: [0],
      cost: 0,
      length: 0,
      currentNode: 0,
    }, columnRange, rowRange);

    return pathLink?.path.map((node) => `${node}`) ?? [];
  }
  private _getRowLink(
    items: GridItem[],
    currentLink: Link,
    columnRange: number[],
    rowRange: number[]
  ): Link {
    const [minColumn] = columnRange;
    const [minRow, maxRow] = rowRange;
    const lastNode = items.length;
    const {
      path,
      length: pathLength,
      cost,
      currentNode,
    } = currentLink;

    // not reached lastNode but path is exceed or the number of remaining nodes is less than minColumn.
    if (currentNode < lastNode && (maxRow <= pathLength || currentNode + minColumn > lastNode)) {
      const rangeCost = getRangeCost(lastNode - currentNode, columnRange);
      const lastCost = rangeCost * Math.abs(this._getCost(items, currentNode, lastNode));

      return {
        ...currentLink,
        length: pathLength + 1,
        path: [...path, lastNode],
        currentNode: lastNode,
        cost: cost + lastCost,
        isOver: true,
      };
    } else if (currentNode >= lastNode) {
      return {
        ...currentLink,
        currentNode: lastNode,
        isOver: minRow > pathLength || maxRow < pathLength,
      };
    } else {
      return this._searchRowLink(items, currentLink, lastNode, columnRange, rowRange);
    }

  }
  private _searchRowLink(
    items: GridItem[],
    currentLink: Link,
    lastNode: number,
    columnRange: number[],
    rowRange: number[]
  ) {
    const [minColumn, maxColumn] = columnRange;
    const {
      currentNode,
      path,
      length: pathLength,
      cost,
    } = currentLink;
    const length = Math.min(lastNode, currentNode + maxColumn);
    const links: Link[] = [];

    for (let nextNode = currentNode + minColumn; nextNode <= length; ++nextNode) {
      if (nextNode === currentNode) {
        continue;
      }
      const nextCost = Math.abs(this._getCost(items, currentNode, nextNode));
      const nextLink = this._getRowLink(items, {
        path: [...path, nextNode],
        length: pathLength + 1,
        cost: cost + nextCost,
        currentNode: nextNode,
      }, columnRange, rowRange);

      if (nextLink) {
        links.push(nextLink);
      }
    }
    links.sort((a, b) => {
      const aIsOver = a.isOver;
      const bIsOver = b.isOver;

      if (aIsOver !== bIsOver) {
        // If it is over, the cost is high.
        return aIsOver ? 1 : -1;
      }
      const aRangeCost = getRangeCost(a.length, rowRange);
      const bRangeCost = getRangeCost(b.length, rowRange);

      return aRangeCost - bRangeCost || a.cost - b.cost;
    });

    // It returns the lowest cost link.
    return links[0];
  }
  private _getExpectedRowSize(items: GridItem[]) {
    const {
      gap,
    } = this.options;
    let containerInlineSize = this.getContainerInlineSize()! - gap * (items.length - 1);
    let ratioSum = 0;
    let inlineSum = 0;

    items.forEach((item) => {
      const inlineSize = item.orgInlineSize;
      const contentSize = item.orgContentSize;

      if (!inlineSize || !contentSize) {
        ratioSum += 1;
        return;
      }
      // sum((expect - offset) * ratio) = container inline size
      const inlineOffset = parseFloat(item.gridData.inlineOffset) || 0;
      const contentOffset = parseFloat(item.gridData.contentOffset) || 0;
      const maintainedRatio = contentSize <= contentOffset ? 1
        : (inlineSize - inlineOffset) / (contentSize - contentOffset);

      ratioSum += maintainedRatio;
      inlineSum += contentOffset * maintainedRatio;
      containerInlineSize -= inlineOffset;
    });

    return ratioSum ? (containerInlineSize + inlineSum) / ratioSum : 0;
  }
  private _getExpectedInlineSize(items: GridItem[], rowSize: number) {
    const {
      gap,
    } = this.options;
    const size = items.reduce((sum, item) => {
      return sum + getExpectedColumnSize(item, rowSize);
    }, 0);

    return size ? size + gap * (items.length - 1) : 0;
  }
  private _getCost(
    items: GridItem[],
    i: number,
    j: number,
  ) {
    const lineItems = items.slice(i, j);
    const rowSize = this._getExpectedRowSize(lineItems);
    const [minSize, maxSize] = this._getSizeRange();

    if (this.isCroppedSize) {
      if (minSize <= rowSize && rowSize <= maxSize) {
        return 0;
      }
      const expectedInlineSize = this._getExpectedInlineSize(
        lineItems,
        rowSize < minSize ? minSize : maxSize,
      );

      return Math.pow(expectedInlineSize - this.getContainerInlineSize(), 2);
    }

    if (isFinite(maxSize)) {
      // if this size is not in range, the cost increases sharply.
      if (rowSize < minSize) {
        return Math.pow(rowSize - minSize, 2) + Math.pow(maxSize, 2);
      } else if (rowSize > maxSize) {
        return Math.pow(rowSize - maxSize, 2) + Math.pow(maxSize, 2);
      }
    } else if (rowSize < minSize) {
      return Math.max(Math.pow(minSize, 2), Math.pow(rowSize, 2)) + Math.pow(maxSize, 2);
    }
    // if this size in range, the cost is row
    return rowSize - minSize;
  }
  private _getPath(items: GridItem[]) {
    const lastNode = items.length;
    const columnRangeOption = this.options.columnRange;
    const [minColumn, maxColumn]: number[] = isObject(columnRangeOption)
      ? columnRangeOption
      : [columnRangeOption, columnRangeOption];

    const graph = (nodeKey: string) => {
      const results: { [key: string]: number } = {};
      const currentNode = parseInt(nodeKey, 10);

      for (let nextNode = Math.min(currentNode + minColumn, lastNode); nextNode <= lastNode; ++nextNode) {
        if (nextNode - currentNode > maxColumn) {
          break;
        }
        let cost = this._getCost(
          items,
          currentNode,
          nextNode,
        );

        if (cost < 0 && nextNode === lastNode) {
          cost = 0;
        }
        results[`${nextNode}`] = Math.pow(cost, 2);
      }
      return results;
    };
    // shortest path for items' total height.
    return find_path(graph, "0", `${lastNode}`);
  }
  private _setStyle(
    items: GridItem[],
    path: string[],
    outline: number[] = [],
    isEndDirection: boolean,
  ) {
    const {
      gap,
      isCroppedSize,
      displayedRow,
    } = this.options;
    const sizeRange = this._getSizeRange();
    const startPoint = outline[0] || 0;
    const containerInlineSize = this.getContainerInlineSize();
    const groups = splitItems(items, path);
    let contentPos = startPoint;
    let displayedSize = 0;

    groups.forEach((groupItems, rowIndex) => {
      const length = groupItems.length;
      let rowSize = this._getExpectedRowSize(groupItems);
      if (isCroppedSize) {
        rowSize = Math.max(sizeRange[0], Math.min(rowSize, sizeRange[1]));
      }
      const expectedInlineSize = this._getExpectedInlineSize(groupItems, rowSize);

      const allGap = gap * (length - 1);
      const scale = (containerInlineSize - allGap) / (expectedInlineSize - allGap);

      groupItems.forEach((item, i) => {
        let columnSize = getExpectedColumnSize(item, rowSize);

        const prevItem = groupItems[i - 1];
        const inlinePos = prevItem
          ? prevItem.cssInlinePos! + prevItem.cssInlineSize! + gap
          : 0;

        if (isCroppedSize) {
          columnSize *= scale;
        }
        item.setCSSGridRect({
          inlinePos,
          contentPos,
          inlineSize: columnSize,
          contentSize: rowSize,
        });
      });
      contentPos += gap + rowSize;
      if (displayedRow < 0 || rowIndex < displayedRow) {
        displayedSize = contentPos;
      }
    });

    if (isEndDirection) {
      // previous group's end outline is current group's start outline
      return {
        start: [startPoint],
        end: [displayedSize],
      };
    }
    // always start is lower than end.
    // contentPos is endPoinnt
    const height = contentPos - startPoint;

    items.forEach((item) => {
      item.cssContentPos! -= height;
    });
    return {
      start: [startPoint - height],
      end: [startPoint], // endPoint - height = startPoint
    };
  }
  public getComputedOutlineLength() {
    return 1;
  }
  public getComputedOutlineSize() {
    return this.getContainerInlineSize();
  }
  private _getRowRange() {
    const rowRange = this.rowRange;
    return isObject(rowRange) ? rowRange : [rowRange, rowRange];
  }
  private _getColumnRange() {
    const columnRange = this.columnRange;
    return isObject(columnRange) ? columnRange : [columnRange, columnRange];
  }
  private _getSizeRange() {
    const sizeRange = this.sizeRange;
    return isObject(sizeRange) ? sizeRange : [sizeRange, sizeRange];
  }
}

export interface JustifiedGrid extends Properties<typeof JustifiedGrid> {
}


/**
 * The minimum and maximum number of items per line.
 * @ko 한 줄에 들어가는 아이템의 최소, 최대 개수.
 * @name Grid.JustifiedGrid#columnRange
 * @type {$ts:Grid.JustifiedGrid.JustifiedGridOptions["columnRange"]}
 * @default [1, 8]
 * @example
 * ```js
 * import { JustifiedGrid } from "@egjs/grid";
 *
 * const grid = new JustifiedGrid(container, {
 *   columnRange: [1, 8],
 * });
 *
 * grid.columnRange = [3, 6];
 * ```
 */


/**
 * The minimum and maximum number of rows in a group, 0 is not set.
 * @ko 한 그룹에 들어가는 행의 최소, 최대 개수, 0은 미설정이다.
 * @name Grid.JustifiedGrid#rowRange
 * @type {$ts:Grid.JustifiedGrid.JustifiedGridOptions["rowRange"]}
 * @default 0
 * @example
 * ```js
 * import { JustifiedGrid } from "@egjs/grid";
 *
 * const grid = new JustifiedGrid(container, {
 *   rowRange: 0,
 * });
 *
 * grid.rowRange = [3, 4];
 * ```
 */

/**
 * The minimum and maximum size by which the item is adjusted. If it is not calculated, it may deviate from the minimum and maximum sizes.
 * @ko 아이템이 조정되는 최소, 최대 사이즈. 계산이 되지 않는 경우 최소, 최대 사이즈를 벗어날 수 있다.
 * @name Grid.JustifiedGrid#sizeRange
 * @type {$ts:Grid.JustifiedGrid.JustifiedGridOptions["sizeRange"]}
 * @default [0, Infinity]
 * @example
 * ```js
 * import { JustifiedGrid } from "@egjs/grid";
 *
 * const grid = new JustifiedGrid(container, {
 *   sizeRange: [0, Infinity],
 * });
 *
 * grid.sizeRange = [200, 800];
 * ```
 */

/**
 * Maximum number of rows to be counted for container size. You can hide it on the screen by setting overflow: hidden. -1 is not set.
 * @ko - 컨테이너 크기에 계산될 최대 row 개수. overflow: hidden을 설정하면 화면에 가릴 수 있다. -1은 미설정이다.
 * @name Grid.JustifiedGrid#displayedRow
 * @type {$ts:Grid.JustifiedGrid.JustifiedGridOptions["displayedRow"]}
 * @default -1
 * @example
 * ```js
 * import { JustifiedGrid } from "@egjs/grid";
 *
 * const grid = new JustifiedGrid(container, {
 *   displayedRow: -1,
 * });
 *
 * grid.displayedRow = 3;
 * ```
 */

/**
 * Whether to crop when the row size is out of sizeRange. If set to true, this ratio can be broken.
 * @ko - row 사이즈가 sizeRange에 벗어나면 크롭할지 여부. true로 설정하면 비율이 깨질 수 있다.
 * @name Grid.JustifiedGrid#isCroppedSize
 * @type {$ts:Grid.JustifiedGrid.JustifiedGridOptions["isCroppedSize"]}
 * @default false
 * @example
 * ```js
 * import { JustifiedGrid } from "@egjs/grid";
 *
 * const grid = new JustifiedGrid(container, {
 *   sizeRange: [200, 250],
 *   isCroppedSize: false,
 * });
 *
 * grid.isCroppedSize = true;
 * ```
 */
