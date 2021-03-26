/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import Grid from "../Grid";
import { PROPERTY_TYPE } from "../consts";
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

/**
 * @typedef
 * @memberof Grid.JustifiedGrid
 * @extends Grid.GridOptions
 * @property - The minimum and maximum number of items per line. (default: [1, 8]) <ko> 한 줄에 들어가는 아이템의 최소, 최대 개수. (default: [1, 8]) </ko>
 * @property - The minimum and maximum number of rows in a group, 0 is not set. (default: 0) <ko> 한 그룹에 들어가는 행의 최소, 최대 개수, 0은 미설정이다. (default: 0) </ko>
 * @property - The minimum and maximum size by which the item is adjusted. If it is not calculated, it may deviate from the minimum and maximum sizes. (default: [0, Infinity]) <ko>아이템이 조정되는 최소, 최대 사이즈. 계산이 되지 않는 경우 최소, 최대 사이즈를 벗어날 수 있다. (default: [0, Infinity])</ko>
 */
export interface JustifiedGridOptions extends GridOptions {
  columnRange?: number | number[];
  rowRange?: number | number[];
  sizeRange?: number[];
}

/**
 * 'justified' is a printing term with the meaning that 'it fits in one row wide'. JustifiedGrid is a grid that the item is filled up on the basis of a line given a size.
 * @ko 'justified'는 '1행의 너비에 맞게 꼭 들어찬'이라는 의미를 가진 인쇄 용어다. JustifiedGrid는 용어의 의미대로 너비가 주어진 사이즈를 기준으로 아이템가 가득 차도록 배치하는 Grid다.
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
  };
  public static defaultOptions: Required<JustifiedGridOptions> = {
    ...Grid.defaultOptions,
    columnRange: [1, 8],
    rowRange: 0,
    sizeRange: [0, Infinity],
  };

  public applyGrid(items: GridItem[], direction: "start" | "end", outline: number[]): GridOutlines {
    const rowRange = this.options.rowRange;
    let path: string[] = [];

    if (items.length) {
      path = rowRange ? this._getRowPath(items) : this._getPath(items);
    }
    return this._setStyle(items, path, outline, direction === "end");
  }
  private _getRowPath(items: GridItem[]) {
    const {
      columnRange: columnRangeOption,
      rowRange: rowRangeOption,
    } = this.options;
    const columnRange = isObject(columnRangeOption) ? columnRangeOption : [columnRangeOption, columnRangeOption];
    const rowRange: number[] = isObject(rowRangeOption) ? rowRangeOption : [rowRangeOption, rowRangeOption];
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
  private _getSize(items: GridItem[]) {
    const {
      gap,
    } = this.options;
    const size = items.reduce((sum, item) => {
      const inlineSize = item.orgInlineSize;
      const contentSize = item.orgContentSize;

      if (!inlineSize || !contentSize) {
        return sum;
      }
      return sum + inlineSize / contentSize;
    }, 0);

    return size ? (this.getContainerInlineSize()! - gap * (items.length - 1)) / size : 0;
  }
  private _getCost(
    items: GridItem[],
    i: number,
    j: number,
  ) {
    const size = this._getSize(items.slice(i, j));
    const [minSize, maxSize] = this.options.sizeRange;

    if (isFinite(maxSize)) {
      // if this size is not in range, the cost increases sharply.
      if (size < minSize) {
        return Math.pow(size - minSize, 2) + Math.pow(maxSize, 2);
      } else if (size > maxSize) {
        return Math.pow(size - maxSize, 2) + Math.pow(maxSize, 2);
      }
    } else if (size < minSize) {
      return Math.max(Math.pow(minSize, 2), Math.pow(size, 2)) + Math.pow(maxSize, 2);
    }
    // if this size in range, the cost is row
    return size - minSize;
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
    } = this.options;
    const length = path.length;
    const startPoint = outline[0] || 0;
    let contentPos = startPoint;

    for (let i = 0; i < length - 1; ++i) {
      const path1 = parseInt(path[i], 10);
      const path2 = parseInt(path[i + 1], 10);
      // pathItems(path1 to path2) are in 1 line.
      const pathItems = items.slice(path1, path2);
      const pathItemsLength = pathItems.length;
      const contentSize = this._getSize(pathItems);

      for (let j = 0; j < pathItemsLength; ++j) {
        const item = pathItems[j];
        const inlineSize = item.orgInlineSize / item.orgContentSize * contentSize;
        const prevItem = pathItems[j - 1];
        const inlinePos = prevItem
          ? prevItem.cssInlinePos + prevItem.cssInlineSize + gap
          : 0;


        item.setCSSGridRect({
          inlinePos,
          contentPos,
          inlineSize,
          contentSize,
        });
      }
      contentPos += gap + contentSize;
    }

    if (isEndDirection) {
      // previous group's end outline is current group's start outline
      return {
        start: [startPoint],
        end: [contentPos],
      };
    }
    // always start is lower than end.
    // contentPos is endPoinnt
    const height = contentPos - startPoint;

    items.forEach((item) => {
      item.cssContentPos -= height;
    });
    return {
      start: [startPoint - height],
      end: [startPoint], // endPoint - height = startPoint
    };
  }
}

export interface JustifiedGrid extends Properties<typeof JustifiedGrid> {
}


/**
 * The minimum and maximum number of items per line. (default: [1, 8])
 * @ko 한 줄에 들어가는 아이템의 최소, 최대 개수. (default: [1, 8])
 * @name Grid.JustifiedGrid#columnRange
 * @type {$ts:Grid.JustifiedGrid.JustifiedGridOptions["columnRange"]}
 * @example
 * import { JustifiedGrid } from "@egjs/grid";
 *
 * const grid = new JustifiedGrid(container, {
 *   columnRange: [1, 8],
 * });
 *
 * grid.columnRange = [3, 6];
 */


/**
 * The minimum and maximum number of rows in a group, 0 is not set. (default: 0)
 * @ko 한 그룹에 들어가는 행의 최소, 최대 개수, 0은 미설정이다. (default: 0)
 * @name Grid.JustifiedGrid#rowRange
 * @type {$ts:Grid.JustifiedGrid.JustifiedGridOptions["rowRange"]}
 * @example
 * import { JustifiedGrid } from "@egjs/grid";
 *
 * const grid = new JustifiedGrid(container, {
 *   rowRange: 0,
 * });
 *
 * grid.rowRange = [3, 4];
 */

/**
 * The minimum and maximum size by which the item is adjusted. If it is not calculated, it may deviate from the minimum and maximum sizes. (default: [0, Infinity])
 * @ko 아이템이 조정되는 최소, 최대 사이즈. 계산이 되지 않는 경우 최소, 최대 사이즈를 벗어날 수 있다. (default: [0, Infinity])
 * @name Grid.JustifiedGrid#sizeRange
 * @type {$ts:Grid.JustifiedGrid.JustifiedGridOptions["sizeRange"]}
 * @example
 * import { JustifiedGrid } from "@egjs/grid";
 *
 * const grid = new JustifiedGrid(container, {
 *   sizeRange: [0, Infinity],
 * });
 *
 * grid.sizeRange = [200, 800];
 */
