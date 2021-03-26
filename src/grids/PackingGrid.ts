/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import Grid from "../Grid";
import { PROPERTY_TYPE } from "../consts";
import { GridOptions, Properties, GridOutlines } from "../types";
import { GetterSetter } from "../utils";
import { GridItem } from "../GridItem";
import BoxModel from "./lib/BoxModel";


function getCost(originLength: number, length: number) {
  let cost = originLength / length;

  if (cost < 1) {
    cost = 1 / cost;
  }

  return cost - 1;
}
function fitArea(
  item: BoxModel,
  bestFitArea: BoxModel,
  itemFitSize: { inlineSize: number, contentSize: number },
  containerFitSize: { inlineSize: number, contentSize: number },
  isContentDirection: boolean,
) {
  item.contentSize = itemFitSize.contentSize;
  item.inlineSize = itemFitSize.inlineSize;
  bestFitArea.contentSize = containerFitSize.contentSize;
  bestFitArea.inlineSize = containerFitSize.inlineSize;

  if (isContentDirection) {
    item.contentPos = bestFitArea.contentPos + bestFitArea.contentSize;
    item.inlinePos = bestFitArea.inlinePos;
  } else {
    item.inlinePos = bestFitArea.inlinePos + bestFitArea.inlineSize;
    item.contentPos = bestFitArea.contentPos;
  }
}


/**
 * @typedef
 * @memberof Grid.PackingGrid
 * @extends Grid.GridOptions
 * @property - The number of columns. If the number of columns is 0, it is automatically calculated according to the size of the container. <ko>열의 개수. 열의 개수가 0이라면, 컨테이너의 사이즈에 의해 계산이 된다. (default: 0) </ko>
 * @property - The size of the columns. If it is 0, it is calculated as the size of the first item in items. (default: 0) <ko> 열의 사이즈. 만약 열의 사이즈가 0이면, 아이템들의 첫번째 아이템의 사이즈로 계산이 된다. (default: 0) </ko>
 * @property - The size ratio(inlineSize / contentSize) of the columns. 0 is not set. (default: 0) <ko>열의 사이즈 비율(inlineSize / contentSize). 0은 미설정이다. </ko>
 * @property - Align of the position of the items. If you want to use `stretch`, be sure to set `column` or `columnSize` option. ("start", "center", "end", "justify", "stretch") (default: "justify") <ko>아이템들의 위치의 정렬. `stretch`를 사용하고 싶다면 `column` 또는 `columnSize` 옵션을 설정해라.  ("start", "center", "end", "justify", "stretch") (default: "justify")</ko>
 */
export interface PackingGridOptions extends GridOptions {
  aspectRatio?: number;
  sizeWeight?: number;
  ratioWeight?: number;
}

/**
 * The PackingGrid is a grid that shows the important items bigger without sacrificing the weight of the items. Rows and columns are separated so that items are dynamically placed within the horizontal and vertical space rather than arranged in an orderly fashion.
 * @ko PackingGrid는 아이템의 본래 크기에 따른 비중을 해치지 않으면서 중요한 카드는 더 크게 보여 주는 레이아웃이다. 행과 열이 구분돼 아이템을 정돈되게 배치하는 대신 가로세로 일정 공간 내에서 동적으로 아이템을 배치한다.
 * @memberof Grid
 * @param {HTMLElement | string} container - A base element for a module <ko>모듈을 적용할 기준 엘리먼트</ko>
 * @param {Grid.PackingGrid.PackingGridOptions} options - The option object of the PackingGrid module <ko>PackingGrid 모듈의 옵션 객체</ko>
 */
@GetterSetter
export class PackingGrid extends Grid<PackingGridOptions> {
  public static propertyTypes = {
    ...Grid.propertyTypes,
    aspectRatio: PROPERTY_TYPE.RENDER_PROPERTY,
    sizeWeight: PROPERTY_TYPE.RENDER_PROPERTY,
    ratioWeight: PROPERTY_TYPE.RENDER_PROPERTY,
  };
  public static defaultOptions: Required<PackingGridOptions> = {
    ...Grid.defaultOptions,
    aspectRatio: 1,
    sizeWeight: 1,
    ratioWeight: 1,
  };


  public applyGrid(items: GridItem[], direction: "start" | "end", outline: number[]): GridOutlines {
    const { aspectRatio, gap } = this.options;
    const containerInlineSize = this.getContainerInlineSize();
    const containerContentSize = containerInlineSize / aspectRatio;
    const prevOutline = outline.length ? outline : [0];
    const startPoint = direction === "end"
      ? Math.max(...prevOutline)
      : Math.min(...prevOutline) - containerContentSize - gap;
    const endPoint = startPoint + containerContentSize + gap;
    const container = new BoxModel({});

    items.forEach((item) => {
      const model = new BoxModel({
        inlineSize: item.orgInlineSize,
        contentSize: item.orgContentSize,
        orgInlineSize: item.orgInlineSize,
        orgContentSize: item.orgContentSize,
      });

      this._findBestFitArea(container, model);
      container.push(model);
      container.scaleTo(containerInlineSize + gap, containerContentSize + gap);
    });
    items.forEach((item, i) => {
      const boxItem = container.items[i];
      const inlineSize = boxItem.inlineSize - gap;
      const contentSize = boxItem.contentSize - gap;
      const contentPos = startPoint + boxItem.contentPos;
      const inlinePos = boxItem.inlinePos;

      item.setCSSGridRect({
        inlinePos,
        contentPos,
        inlineSize,
        contentSize,
      });
    });

    return {
      start: [startPoint],
      end: [endPoint],
    };
  }
  private _findBestFitArea(container: BoxModel, item: BoxModel) {
    if (container.getRatio() === 0) { // 아이템 최초 삽입시 전체영역 지정
      container.orgInlineSize = item.inlineSize;
      container.orgContentSize = item.contentSize;
      container.inlineSize = item.inlineSize;
      container.contentSize = item.contentSize;
      return;
    }

    let bestFitArea!: BoxModel;
    let minCost = Infinity;
    let isContentDirection = false;
    const itemFitSize = {
      inlineSize: 0,
      contentSize: 0,
    };
    const containerFitSize = {
      inlineSize: 0,
      contentSize: 0,
    };
    const { sizeWeight, ratioWeight } = this.options;

    container.items.forEach((child) => {
      const containerSizeCost = getCost(child.getOrgSizeWeight(), child.getSize()) * sizeWeight;
      const containerRatioCost = getCost(child.getOrgRatio(), child.getRatio()) * ratioWeight;
      const inlineSize = child.inlineSize;
      const contentSize = child.contentSize;
      for (let i = 0; i < 2; ++i) {
        let itemInlineSize;
        let itemContentSize;
        let containerInlineSize;
        let containerContentSize;

        if (i === 0) {
          // add item to content pos (top, bottom)
          itemInlineSize = inlineSize;
          itemContentSize = contentSize * (item.contentSize / (child.orgContentSize + item.contentSize));
          containerInlineSize = inlineSize;
          containerContentSize = contentSize - itemContentSize;
        } else {
          // add item to inline pos (left, right)
          itemContentSize = contentSize;
          itemInlineSize = inlineSize * (item.inlineSize / (child.orgInlineSize + item.inlineSize));
          containerContentSize = contentSize;
          containerInlineSize = inlineSize - itemInlineSize;
        }

        const itemSize = itemInlineSize * itemContentSize;
        const itemRatio = itemInlineSize / itemContentSize;
        const containerSize = containerInlineSize * containerContentSize;
        const containerRatio = containerContentSize / containerContentSize;

        let cost = getCost(item.getSize(), itemSize) * sizeWeight;
        cost += getCost(item.getRatio(), itemRatio) * ratioWeight;
        cost += getCost(child.getOrgSizeWeight(), containerSize) * sizeWeight - containerSizeCost;
        cost += getCost(child.getOrgRatio(), containerRatio) * ratioWeight - containerRatioCost;

        if (cost === Math.min(cost, minCost)) {
          minCost = cost;
          bestFitArea = child;
          isContentDirection = (i === 0);
          itemFitSize.inlineSize = itemInlineSize;
          itemFitSize.contentSize = itemContentSize;
          containerFitSize.inlineSize = containerInlineSize;
          containerFitSize.contentSize = containerContentSize;
        }
      }
    });

    fitArea(item, bestFitArea, itemFitSize, containerFitSize, isContentDirection);
  }
}

export interface PackingGrid extends Properties<typeof PackingGrid> {
}


/**
 * Align of the position of the items. If you want to use `stretch`, be sure to set `column` or `columnSize` option. ("start", "center", "end", "justify", "stretch") (default: "justify")
 * @ko 아이템들의 위치의 정렬. `stretch`를 사용하고 싶다면 `column` 또는 `columnSize` 옵션을 설정해라.  ("start", "center", "end", "justify", "stretch") (default: "justify")
 * @name Grid.PackingGrid#align
 * @type {$ts:Grid.PackingGrid.PackingGridOptions["align"]}
 * @example
 * import { PackingGrid } from "@egjs/grid";
 *
 * const grid = new PackingGrid(container, {
 *   align: "start",
 * });
 *
 * grid.align = "justify";
 */


/**
 * The number of columns. If the number of columns is 0, it is automatically calculated according to the size of the container.
 * @ko 열의 개수. 열의 개수가 0이라면, 컨테이너의 사이즈에 의해 계산이 된다. (default: 0)
 * @name Grid.PackingGrid#column
 * @type {$ts:Grid.PackingGrid.PackingGridOptions["column"]}
 * @example
 * import { PackingGrid } from "@egjs/grid";
 *
 * const grid = new PackingGrid(container, {
 *   column: 0,
 * });
 *
 * grid.column = 4;
 */


/**
 * The size of the columns. If it is 0, it is calculated as the size of the first item in items. (default: 0)
 * @ko 열의 사이즈. 만약 열의 사이즈가 0이면, 아이템들의 첫번째 아이템의 사이즈로 계산이 된다. (default: 0)
 * @name Grid.PackingGrid#columnSize
 * @type {$ts:Grid.PackingGrid.PackingGridOptions["columnSize"]}
 * @example
 * import { PackingGrid } from "@egjs/grid";
 *
 * const grid = new PackingGrid(container, {
 *   columnSize: 0,
 * });
 *
 * grid.columnSize = 200;
 */


/**
 * The size ratio(inlineSize / contentSize) of the columns. 0 is not set. (default: 0)
 * @ko 열의 사이즈 비율(inlineSize / contentSize). 0은 미설정이다.
 * @name Grid.PackingGrid#columnSizeRatio
 * @type {$ts:Grid.PackingGrid.PackingGridOptions["columnSizeRatio"]}
 * @example
 * import { PackingGrid } from "@egjs/grid";
 *
 * const grid = new PackingGrid(container, {
 *   columnSizeRatio: 0,
 * });
 *
 * grid.columnSizeRatio = 0.5;
 */
