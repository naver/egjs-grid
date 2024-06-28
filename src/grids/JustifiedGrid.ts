/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import Grid from "../Grid";
import { MOUNT_STATE, PROPERTY_TYPE } from "../consts";
import { GridOptions, GridOutlines, Properties } from "../types";
import { between, getRangeCost, GetterSetter, isNumber, isObject, sum, throttle } from "../utils";
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
  const inlineOffset = item.gridData.inlineOffset || 0;
  const contentOffset = item.gridData.contentOffset || 0;

  if (!inlineSize || !contentSize) {
    return rowSize;
  }

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
  /**
   * The ratio is maintained except for the offset value in the inline direction. If 'data-grid-inline-offset' is set in the element of each item, it will be applied first.
   * <ko>inline 방향의 offset 수치 만큼 제외하고 비율을 유지한다. 각 아이템의 element에 'data-grid-inline-offset' 을 설정하면 우선 적용한다.</ko>
   * @default 0
   */
  inlineOffset?: number;
  /**
   * The ratio is maintained except for the offset value in the content direction. If 'data-grid-content-offset' is set in the element or JSX of each item, it will be applied first.
   * <ko>content 방향의 offset 수치 만큼 제외하고 비율을 유지한다. 각 아이템의 Element 또는 JSX에 'data-grid-content-offset' 을 설정하면 우선 적용한다.</ko>
   * @default 0
   */
  contentOffset?: number;
  /**
   * it is possible to basically break the proportion of the item and stretch the inline size to fill the container.
   * If you set the `sizeRange` range narrowly, you can stretch well.
   * <ko>기본적으로 아이템의 비율을 깨서 inline size를 stretch하여 container를 꽉 채우게 가능하다. sizeRange의 범위를 좁게 설정하면 stretch가 잘 될 수 있다. </ko>
   * @default false
   */
  stretch?: boolean;
  /**
   * If `-`, `+`, or `%` are added as a string value, it is a relative value to the original size. If it is a number value, the stretch range can be set as an absolute value.
   * If `data-grid-min-stretch` and `data-grid-max-stretch` are set in the Element or JSX of each item, they will be applied first.
   * <ko>string 값으로 `-`, `+`, `%`이 붙으면 원본 크기에 대한 상대값이며 number 값으로 들어오면 절대 값으로 stretch 범위를 설정할 수 있습니다.
   * 각 아이템의 Element 또는 JSX에 `data-grid-min-stretch`, `data-grid-max-stretch`을 설정하면 우선 적용한다.</ko>
   * @
   * @default ["-10%", "+10%"]
   */
  stretchRange?: Array<string | number>;
  /**
   * Items placed in the last row are not stretched and are drawn maintaining their proportions. When using InfiniteGrid, it is calculated and re-rendered as follows:
   * <ko>마지막 row에 배치되는 아이템들 경우 stretch되지 않고 비율유지한채로 그려진다. InfiniteGrid를 사용하는 경우 다음 그룹과 같이 계산되어 재렌더링한다.</ko>
   */
  passUnstretchRow?: boolean;
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
    inlineMargin: PROPERTY_TYPE.RENDER_PROPERTY,
    contentMargin: PROPERTY_TYPE.RENDER_PROPERTY,
    inlineOffset: PROPERTY_TYPE.RENDER_PROPERTY,
    contentOffset: PROPERTY_TYPE.RENDER_PROPERTY,
  };
  public static defaultOptions: Required<JustifiedGridOptions> = {
    ...Grid.defaultOptions,
    columnRange: [1, 8],
    rowRange: 0,
    sizeRange: [0, Infinity],
    displayedRow: -1,
    isCroppedSize: false,
    stretch: false,
    passUnstretchRow: true,
    stretchRange: ["-20%", "+20%"],
    inlineOffset: 0,
    contentOffset: 0,
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
      let inlineOffset = parseFloat(attributes.inlineOffset);
      let contentOffset = parseFloat(attributes.contentOffset);
      // let contentMargin = parseFloat(attributes.contentMargin);

      if (isNaN(inlineOffset)) {
        inlineOffset = this.inlineOffset || gridData.inlineOffset || 0;
      }
      if (isNaN(contentOffset)) {
        contentOffset = this.contentOffset || gridData.contentOffset | 0;
      }
      // if (isNaN(contentMargin)) {
      //   contentMargin = this.contentMargin || gridData.contentMargin | 0;
      // }

      if (
        element && !("inlineOffset" in attributes) && !("contentOffset" in attributes)
        && item.mountState === MOUNT_STATE.MOUNTED
      ) {
        const maintainedTarget = element.querySelector<HTMLImageElement>(`[${attributePrefix}maintained-target]`);

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
      // gridData.contentMargin = contentMargin;
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
      const inlineOffset = item.gridData.inlineOffset || 0;
      const contentOffset = item.gridData.contentOffset || 0;
      // const contentMargin = item.gridData.contentMargin || 0;

      const maintainedRatio = contentSize <= contentOffset ? 1
        : (inlineSize - inlineOffset) / (contentSize - contentOffset);

      ratioSum += maintainedRatio;
      // inlineSum += (contentOffset + contentMargin) * maintainedRatio;
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
          return prev + parseStretchSize(itemInlineSize, items[i].attributes.minStretch || stretchRange[0]);
        }, 0);
        const maxInlineSize = inlineSizes.reduce((prev, itemInlineSize, i) => {
          return prev + parseStretchSize(itemInlineSize, items[i].attributes.maxStretch || stretchRange[1]);
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

  private _getExpectedInlineSizes(items: GridItem[], rowSize: number) {
    const {
      stretch,
      stretchRange,
    } = this.options;
    return items.map((item) => {
      const minInlineSize = stretch
        ? parseStretchSize(item.orgInlineSize, item.attributes.minStretch || stretchRange[0])
        : -Infinity;
      const maxInlineSize = stretch
        ? parseStretchSize(item.orgInlineSize, item.attributes.maxStretch || stretchRange[1])
        : Infinity;

      const itemInlineSize = getExpectedItemInlineSize(item, rowSize);
      let isMax = false;
      let isMin = false;
      if (itemInlineSize >= maxInlineSize) {
        isMax = true;
      } else if (itemInlineSize <= minInlineSize) {
        isMin = true;
      }

      return {
        minSize: minInlineSize,
        maxSize: maxInlineSize,
        size: between(itemInlineSize, minInlineSize, maxInlineSize),
        originalSize: itemInlineSize,
        isMax,
        isMin,
      };
    });
  }
  private _getStretchItemInfos(items: GridItem[], rowSize: number) {
    const itemsLength = items.length;
    const containerInlineSize = this.getContainerInlineSize() - this.getInlineGap() * (Math.max(1, itemsLength) - 1);
    const itemInfos = this._getExpectedInlineSizes(items, rowSize);
    const firstItemsSize = sum(itemInfos.map((info) => info.size));
    const distSize = containerInlineSize - firstItemsSize;
    const firstScale = containerInlineSize / sum(itemInfos.map((info) => info.originalSize));
    const costInfos = itemInfos.map((info) => {
      return {
        ...info,
        passed: false,
        size: info.originalSize * firstScale,
      };
    });

    if (distSize === 0) {
      return {
        infos: costInfos,
        cost: 0,
      };
    }
    // increase
    const isIncrease = distSize > 0;
    const costInfosLength = costInfos.length;

    for (let i = 0; i < costInfosLength; ++i) {
      const passedItemsSize = sum(costInfos.map((info) => info.passed ? info.size : 0));
      const restItemsSize = sum(costInfos.map((info) => info.passed ? 0 : info.originalSize));
      let distScale = (containerInlineSize - passedItemsSize) / restItemsSize;
      // minimize or maximize
      costInfos.forEach((info) => {
        if (info.passed) {
          return;
        }

        if (isIncrease) {
          if (info.size > info.maxSize) {
            distScale = Math.min(distScale, info.maxSize / info.originalSize);
          }
        } else {
          if (info.size < info.minSize) {
            distScale = Math.max(distScale, info.minSize / info.originalSize);
          }
        }
      });

      costInfos.forEach((info) => {
        if (!info.passed) {
          info.size = between(info.originalSize * distScale, info.minSize, info.maxSize);

          if (
            (isIncrease && !throttle(info.size - info.maxSize, 0.001))
            || (!isIncrease && !throttle(info.size - info.minSize, 0.001))
          ) {
            info.passed = true;
          }
        }
      });

      if (costInfos.every((info) => info.passed)) {
        break;
      }
    }
    const lastDistScale = containerInlineSize / sum(costInfos.map((info) => info.size));

    // last
    if (throttle(lastDistScale - 1, 0.001)) {
      costInfos.forEach((info) => {
        info.size *= lastDistScale;
      });
    }


    return {
      infos: costInfos,
      cost: sum(costInfos.map((info) => {
        let costRatio = 1;

        if (info.size > info.maxSize || info.size < info.minSize) {
          costRatio = 2;
        }
        let originalSize = info.originalSize;

        if (isIncrease) {
          originalSize = Math.max(originalSize, info.minSize);
        } else {
          originalSize = Math.min(originalSize, info.maxSize);
        }
        return Math.abs(info.size - originalSize) * costRatio;
      })),
    };
  }
  private _getExpectedInlineSize(items: GridItem[], rowSize: number) {
    const inlineGap = this.getInlineGap();
    const itemInfos = this._getExpectedInlineSizes(items, rowSize);

    return itemInfos.length ? sum(itemInfos.map((info) => info.size)) + inlineGap * (items.length - 1) : 0;
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
      const sizeCost = Math.abs(rowSize - minSize);

      const expectedInlineSize = this._getExpectedInlineSize(
        lineItems,
        rowSize,
      );

      if (
        !this.passUnstretchRow
        || (isEndDirection ? j !== items.length : i !== 0)
        || expectedInlineSize >= containerInlineSize
      ) {
        const res = this._getStretchItemInfos(lineItems, rowSize);

        extraCost = res.cost;
      }

      return extraCost + sizeCost;
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
      const noGapExpectedContainerInlineSize = expectedInlineSize - allGap;
      const noGapContainerInlineSize = containerInlineSize - allGap;

      if (stretch && expectedInlineSize && noGapContainerInlineSize !== noGapExpectedContainerInlineSize) {
        // passed이고 마지막 그룹의 경우 stretchSize가 containerSize보다 작으면 pass!
        if (
          passUnstretchRow && noGapExpectedContainerInlineSize < noGapContainerInlineSize
          && (isEndDirection ? rowIndex === groupsLength - 1 : rowIndex === 0)
        ) {
          passedPoint = [contentPos];
          passedItems = groupItems.map((_, i) => itemsLength - groupItemslength + i);

          const inlineSizes = this._getExpectedInlineSizes(groupItems, rowSize);

          itemInfos.forEach((info, i) => {
            info.minInlineSize = inlineSizes[i].minSize;
            info.maxInlineSize = inlineSizes[i].maxSize;
            info.inlineSize = between(info.inlineSize, info.minInlineSize, info.maxInlineSize);

          });
        } else {
          const { infos } = this._getStretchItemInfos(groupItems, rowSize);

          itemInfos.forEach((info, i) => {
            info.inlineSize = infos[i].size;
            info.minInlineSize = infos[i].minSize;
            info.maxInlineSize = infos[i].maxSize;
          });
        }
      }

      itemInfos.forEach((info, i) => {
        const {
          item,
          inlineSize,

        } = info;
        let nextInlineSize = inlineSize;
        const prevItem = groupItems[i - 1];
        const inlinePos = prevItem
          ? prevItem.cssInlinePos! + prevItem.cssInlineSize! + inlineGap
          : 0;

        if (isCroppedSize) {
          nextInlineSize *= scale;
        }


        const gridData = item.gridData;

        gridData.orgInlineSize = info.orgInlineSize;
        gridData.orgContentSize = rowSize;
        gridData.minInlineSize = info.minInlineSize;
        gridData.maxInlineSize = info.maxInlineSize;

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
