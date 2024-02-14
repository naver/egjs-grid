/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import Grid from "../Grid";
import { MOUNT_STATE, PROPERTY_TYPE } from "../consts";
import { GridOptions, GridOutlines, Properties } from "../types";
import { between, getRangeCost, GetterSetter, isNumber, isObject, throttle } from "../utils";
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

function parseStretchSize(inlineSize: number, size: number | string) {
  if (isNumber(size)) {
    return size;
  }
  const signText = size.charAt(0);
  const sign = signText === "+" ? 1 : (signText === "-" ? -1 : 0);
  let nextSize = parseFloat(size);

  if (size.match(/%$/g)) {
    nextSize *= inlineSize / 100;
  }
  if (sign) {
    return inlineSize + nextSize;
  }
  return nextSize;
}

function getExpectedItemInlineSize(item: GridItem, rowSize: number) {
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
   * 아이템의 inlineSize를 stretch 할지 여부
   * @default false
   */
  stretch?: boolean;
  /**
   * string 값으로 `-`, `+`, `%`이 붙으면 원본 크기에 대한 상대값이며 number 값으로 들어오면 절대 값으로 stretch 범위를 설정할 수 있습니다.
   * 낱개로 설정하고 싶다면 각 Element 또는 JSX로 data-grid-min-stretch="-10%", data-grid-max-stretch="+10%"로 설정할 수 있다.
   * @default ["-10%", "+10%"]
   */
  stretchRange?: Array<string | number>;
  /**
   * 마지막 열에 stretch 범위에 벗어난 경우 다음 InfiniteGrid
   */
  passUnstretchRow?: boolean;
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
    stretch: PROPERTY_TYPE.RENDER_PROPERTY,
    stretchRange: PROPERTY_TYPE.RENDER_PROPERTY,
    passUnstretchRow: PROPERTY_TYPE.RENDER_PROPERTY,
  };
  public static defaultOptions: Required<JustifiedGridOptions> = {
    ...Grid.defaultOptions,
    columnRange: [1, 8],
    rowRange: 0,
    sizeRange: [0, Infinity],
    displayedRow: -1,
    isCroppedSize: false,
    stretch: false,
    passUnstretchRow: false,
    stretchRange: ["-20%", "+20%"],
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

    const isEndDirection = direction === "end";

    if (items.length) {
      path = rowRange ? this._getRowPath(items, isEndDirection) : this._getPath(items, isEndDirection);
    }

    return this._setStyle(items, path, outline, direction === "end");
  }
  private _getRowPath(items: GridItem[], isEndDirection: boolean) {
    const columnRange = this._getColumnRange();
    const rowRange = this._getRowRange();

    const pathLink = this._getRowLink(items, {
      path: [0],
      cost: 0,
      length: 0,
      currentNode: 0,
    }, columnRange, rowRange, isEndDirection);

    return pathLink?.path.map((node) => `${node}`) ?? [];
  }
  private _getRowLink(
    items: GridItem[],
    currentLink: Link,
    columnRange: number[],
    rowRange: number[],
    isEndDirection: boolean,
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
      const lastCost = rangeCost * Math.abs(this._getCost(items, currentNode, lastNode, isEndDirection));

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
      return this._searchRowLink(items, currentLink, lastNode, columnRange, rowRange, isEndDirection);
    }

  }
  private _searchRowLink(
    items: GridItem[],
    currentLink: Link,
    lastNode: number,
    columnRange: number[],
    rowRange: number[],
    isEndDirection: boolean,
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
      const nextCost = Math.abs(this._getCost(items, currentNode, nextNode, isEndDirection));
      const nextLink = this._getRowLink(items, {
        path: [...path, nextNode],
        length: pathLength + 1,
        cost: cost + nextCost,
        currentNode: nextNode,
      }, columnRange, rowRange, isEndDirection);

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
  private _getExpectedRowSize(items: GridItem[], forceStretch?: boolean) {
    const containerInlineSize = this.getContainerInlineSize()! - this.getInlineGap() * (items.length - 1);
    let fixedContainerInsize = containerInlineSize;
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
      fixedContainerInsize -= inlineOffset;
    });

    if (ratioSum) {
      const nextRowSize = (fixedContainerInsize + inlineSum) / ratioSum;

      if (this.stretch) {
        const [minRowSize, maxRowSize] = this._getSizeRange();
        const stretchRowSize = between(nextRowSize, minRowSize, maxRowSize);

        if (forceStretch) {
          return stretchRowSize;
        }
        const stretchRange = this.stretchRange;
        const inlineSizes = items.map((item) => {
          return getExpectedItemInlineSize(item, stretchRowSize);
        });
        const minInlineSize = inlineSizes.reduce((prev, itemInlineSize, i) => {
          return prev + parseStretchSize(itemInlineSize, items[i].gridData.minStretch || stretchRange[0]);
        }, 0);
        const maxInlineSize = inlineSizes.reduce((prev, itemInlineSize, i) => {
          return prev + parseStretchSize(itemInlineSize, items[i].gridData.maxStretch || stretchRange[1]);
        }, 0);

        // for stretch
        if (minInlineSize <= containerInlineSize && containerInlineSize <= maxInlineSize) {
          return stretchRowSize;
        }
      }

      return nextRowSize;
    }
    return 0;
  }
  private _getExpectedInlineSize(items: GridItem[], rowSize: number) {
    const inlineGap = this.getInlineGap();
    const size = items.reduce((sum, item) => {
      return sum + getExpectedItemInlineSize(item, rowSize);
    }, 0);

    return size ? size + inlineGap * (items.length - 1) : 0;
  }
  private _getCost(
    items: GridItem[],
    i: number,
    j: number,
    isEndDirection: boolean,
  ) {
    const lineItems = items.slice(i, j);
    const containerInlineSize = this.getContainerInlineSize();
    let rowSize = this._getExpectedRowSize(lineItems);
    const [minSize, maxSize] = this._getSizeRange();

    if (this.isCroppedSize) {
      if (minSize <= rowSize && rowSize <= maxSize) {
        return 0;
      }
      const expectedInlineSize = this._getExpectedInlineSize(
        lineItems,
        rowSize < minSize ? minSize : maxSize,
      );

      return Math.pow(expectedInlineSize - containerInlineSize, 2);
    }
    let extraCost = 0;

    if (this.stretch) {
      if (rowSize < minSize) {
        rowSize = minSize;
      } else if (rowSize > maxSize) {
        rowSize = maxSize;
      }

      const expectedInlineSize = this._getExpectedInlineSize(
        lineItems,
        rowSize,
      );

      if (
        !this.passUnstretchRow
        || (isEndDirection ? j !== items.length : i !== 0)
        || expectedInlineSize >= containerInlineSize
      ) {
        extraCost = Math.abs(containerInlineSize - expectedInlineSize) / items.length;
      }

      return extraCost;
    }

    if (isFinite(maxSize)) {
      // if this size is not in range, the cost increases sharply.
      if (rowSize < minSize) {
        return Math.pow(rowSize - minSize, 2) + Math.pow(maxSize, 2) + extraCost;
      } else if (rowSize > maxSize) {
        return Math.pow(rowSize - maxSize, 2) + Math.pow(maxSize, 2) + extraCost;
      }
    } else if (rowSize < minSize) {
      return Math.max(Math.pow(minSize, 2), Math.pow(rowSize, 2)) + Math.pow(maxSize, 2) + extraCost;
    }
    // if this size in range, the cost is row
    return rowSize - minSize + extraCost;
  }
  private _getPath(items: GridItem[], isEndDirection: boolean) {
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
          isEndDirection,
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
      isCroppedSize,
      displayedRow,
      stretch,
      stretchRange,
      passUnstretchRow,
    } = this.options;
    const itemsLength = items.length;
    const sizeRange = this._getSizeRange();
    const startPoint = outline[0] || 0;
    const containerInlineSize = this.getContainerInlineSize();
    const inlineGap = this.getInlineGap();
    const contentGap = this.getContentGap();
    const groups = splitItems(items, path);
    let passedItems!: number[];
    const groupsLength = groups.length;
    let contentPos = startPoint;
    let displayedSize = 0;
    let passedPoint!: number[];

    groups.forEach((groupItems, rowIndex) => {
      const groupItemslength = groupItems.length;
      let rowSize = this._getExpectedRowSize(groupItems, true);

      if (isCroppedSize) {
        rowSize = Math.max(sizeRange[0], Math.min(rowSize, sizeRange[1]));
      }
      const allGap = inlineGap * (length - 1);
      const itemInfos = groupItems.map((item, index) => {
        const itemInlineSize = getExpectedItemInlineSize(item, rowSize);

        return {
          index,
          item,
          inlineSize: itemInlineSize,
          orgInlineSize: itemInlineSize,
          maxInlineSize: itemInlineSize,
          minInlineSize: itemInlineSize,
        };
      });
      const expectedInlineSize = this._getExpectedInlineSize(groupItems, rowSize);
      const scale = (containerInlineSize - allGap) / (expectedInlineSize - allGap);
      let noGapExpectedContainerInlineSize = expectedInlineSize - allGap;
      let noGapContainerInlineSize = containerInlineSize - allGap;

      if (stretch && expectedInlineSize && noGapContainerInlineSize !== noGapExpectedContainerInlineSize) {
        // passed이고 마지막 그룹의 경우 stretchSize가 containerSize보다 작으면 pass!
        if (
          passUnstretchRow && noGapExpectedContainerInlineSize < noGapContainerInlineSize
          && (isEndDirection ? rowIndex === groupsLength - 1 : rowIndex === 0)
        ) {
          passedPoint = [contentPos];
          passedItems = groupItems.map((_, i) => itemsLength - groupItemslength + i);
        } else {
          itemInfos.forEach((info) => {
            info.minInlineSize = parseStretchSize(info.orgInlineSize, info.item.gridData.minStretch || stretchRange[0]);
            info.maxInlineSize = parseStretchSize(info.orgInlineSize, info.item.gridData.maxStretch || stretchRange[1]);
          });

          const itemInfoslength = itemInfos.length;
          let subInfos = [...itemInfos];

          for (let i = 0; i < itemInfoslength; ++i) {
            const maxRatio = Math.max(1, ...subInfos.map((info) => info.minInlineSize / info.orgInlineSize));
            const minRatio = Math.min(1, ...subInfos.map((info) => info.maxInlineSize / info.orgInlineSize));
            let stretchScale = 1;

            if (noGapContainerInlineSize > noGapExpectedContainerInlineSize) {
              // increase inline size
              stretchScale = Math.min(minRatio, 1);

              if (stretchScale === 1 && maxRatio !== 1) {
                stretchScale = maxRatio;

              }
            } else {
              // decrease inline size
              stretchScale = Math.max(1, maxRatio);

              if (stretchScale === 1 && minRatio !== 1) {
                stretchScale = minRatio;
              }
            }

            noGapExpectedContainerInlineSize *= stretchScale;
            subInfos.forEach((info) => {
              info.orgInlineSize *= stretchScale;

              const nextInlineSize = between(
                info.orgInlineSize,
                info.minInlineSize,
                info.maxInlineSize,
              );


              noGapExpectedContainerInlineSize += nextInlineSize - info.orgInlineSize;
              info.orgInlineSize = nextInlineSize;
            });

            if (noGapContainerInlineSize > noGapExpectedContainerInlineSize) {
              // increase inline size
              subInfos.sort((a, b) => {
                return b.orgInlineSize - a.orgInlineSize;
              });
            } else {
              // decrease inline size
              subInfos.sort((a, b) => {
                return a.orgInlineSize - b.orgInlineSize;
              });
            }
            const firstInfo = subInfos[0];
            const expectedScale = noGapContainerInlineSize / noGapExpectedContainerInlineSize;
            const nextInlineSize = between(
              firstInfo.orgInlineSize * expectedScale,
              firstInfo.minInlineSize,
              firstInfo.maxInlineSize,
            );

            noGapContainerInlineSize -= nextInlineSize;
            noGapExpectedContainerInlineSize -= firstInfo.orgInlineSize;
            firstInfo.inlineSize = nextInlineSize;
            subInfos = subInfos.slice(1);
          }
          noGapContainerInlineSize = throttle(noGapContainerInlineSize, 0.001);

          if (noGapContainerInlineSize) {
            // WARN: A gap appears. It exceeds minSize and maxSize.
            const extraInlineSize = itemInfos.reduce((prev, cur) => prev + cur.inlineSize, 0);
            const extraScale = (containerInlineSize - allGap) / extraInlineSize;

            itemInfos.forEach((info) => {
              info.inlineSize *= extraScale;
            });
          }

          itemInfos.sort((a, b) => {
            return a.index - b.index;
          });
        }
      }

      itemInfos.forEach(({ item, inlineSize }, i) => {
        let nextInlineSize = inlineSize;
        const prevItem = groupItems[i - 1];
        const inlinePos = prevItem
          ? prevItem.cssInlinePos! + prevItem.cssInlineSize! + inlineGap
          : 0;

        if (isCroppedSize) {
          nextInlineSize *= scale;
        }
        item.setCSSGridRect({
          inlinePos,
          contentPos,
          inlineSize: nextInlineSize,
          contentSize: rowSize,
        });
      });
      contentPos += contentGap + rowSize;
      if (displayedRow < 0 || rowIndex < displayedRow) {
        displayedSize = contentPos;
      }
    });

    if (isEndDirection) {
      // previous group's end outline is current group's start outline
      return {
        start: [startPoint],
        end: [displayedSize],
        passedItems,
        passed: passedPoint,
      };
    }
    // always start is lower than end.
    // contentPos is endPoinnt
    const height = contentPos - startPoint;

    items.forEach((item) => {
      item.cssContentPos! -= height;
    });
    return {
      passedItems,
      passed: passedPoint ? [passedPoint[0] - height] : null,
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
