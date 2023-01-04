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
 */
export interface PackingGridOptions extends GridOptions {
  /**
   * The aspect ratio (inlineSize / contentSize) of the container with items.
   * <ko>아이템들을 가진 컨테이너의 종횡비(inlineSize / contentSize).</ko>
   * @default 1
   */
  aspectRatio?: number;
  /**
   * The size weight when placing items.
   * <ko>아이템들을 배치하는데 사이즈 가중치.</ko>
   * @default 1
   */
  sizeWeight?: number;
  /**
   * The weight to keep ratio when placing items.
   * <ko>아이템들을 배치하는데 비율을 유지하는 가중치.</ko>
   * @default 1
   */
  ratioWeight?: number;
  /**
   * The priority that determines the weight of the item. "size" = (sizeWieght: 100, ratioWeight: 1), "ratio" = (sizeWeight: 1, ratioWeight; 100), "custom" = (set sizeWeight, ratioWeight)
   * item's weight = item's ratio(inlineSize / contentSize) change * `ratioWeight` + size(inlineSize * contentSize) change * `sizeWeight`.
   * <ko> 아이템의 가중치를 결정하는 우선수치. "size" = (sizeWieght: 100, ratioWeight: 1), "ratio" = (sizeWeight: 1, ratioWeight; 100), "custom" = (set sizeWeight, ratioWeight). 아이템의 가중치 = ratio(inlineSize / contentSize)의 변화량 * `ratioWeight` + size(inlineSize * contentSize)의 변화량 * `sizeWeight`.</ko>
   * @default "custom"
   */
  weightPriority?: "size" | "ratio" | "custom";
}

/**
 * The PackingGrid is a grid that shows the important items bigger without sacrificing the weight of the items.
 * Rows and columns are separated so that items are dynamically placed within the horizontal and vertical space rather than arranged in an orderly fashion.
 * If `sizeWeight` is higher than `ratioWeight`, the size of items is preserved as much as possible.
 * Conversely, if `ratioWeight` is higher than `sizeWeight`, the ratio of items is preserved as much as possible.
 * @ko PackingGrid는 아이템의 본래 크기에 따른 비중을 해치지 않으면서 중요한 카드는 더 크게 보여 주는 레이아웃이다.
 * 행과 열이 구분돼 아이템을 정돈되게 배치하는 대신 가로세로 일정 공간 내에서 동적으로 아이템을 배치한다.
 * `sizeWeight`가 `ratioWeight`보다 높으면 아이템들의 size가 최대한 보존이 된다.
 * 반대로 `ratioWeight`가 `sizeWeight`보다 높으면 아이템들의 비율이 최대한 보존이 된다.
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
    weightPriority: PROPERTY_TYPE.RENDER_PROPERTY,
  };
  public static defaultOptions: Required<PackingGridOptions> = {
    ...Grid.defaultOptions,
    aspectRatio: 1,
    sizeWeight: 1,
    ratioWeight: 1,
    weightPriority: "custom",
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
    const sizeWeight = this._getWeight("size");
    const ratioWeight = this._getWeight("ratio");

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
  public getComputedOutlineLength() {
    return 1;
  }
  public getComputedOutlineSize() {
    return this.getContainerInlineSize();
  }
  private _getWeight(type: "size" | "ratio"): number {
    const options = this.options;
    const weightPriority = options.weightPriority;

    if (weightPriority === type) {
      return 100;
    } else if (weightPriority === "custom") {
      return options[`${type}Weight`];
    }
    return 1;
  }
}

export interface PackingGrid extends Properties<typeof PackingGrid> {
}


/**
 * The aspect ratio (inlineSize / contentSize) of the container with items.
 * @ko 아이템들을 가진 컨테이너의 종횡비(inlineSize / contentSize).
 * @name Grid.PackingGrid#aspectRatio
 * @type {$ts:Grid.PackingGrid.PackingGridOptions["aspectRatio"]}
 * @default 1
 * @example
 * ```js
 * import { PackingGrid } from "@egjs/grid";
 *
 * const grid = new PackingGrid(container, {
 *   aspectRatio: 1,
 * });
 *
 * grid.aspectRatio = 1.5;
 * ```
 */

/**
 * The priority that determines the weight of the item. "size" = (sizeWieght: 2, ratioWeight: 1), "ratio" = (sizeWeight: 1, ratioWeight; 2), "custom" = (set sizeWeight, ratioWeight)
 * item's weight = item's ratio(inlineSize / contentSize) change * `ratioWeight` + size(inlineSize * contentSize) change * `sizeWeight`.
 * @ko 아이템의 가중치를 결정하는 우선수치. "size" = (sizeWieght: 2, ratioWeight: 1), "ratio" = (sizeWeight: 1, ratioWeight; 2), "custom" = (set sizeWeight, ratioWeight). 아이템의 가중치 = ratio(inlineSize / contentSize)의 변화량 * `ratioWeight` + size(inlineSize * contentSize)의 변화량 * `sizeWeight`.
 * @name Grid.PackingGrid#weightPriority
 * @type {$ts:Grid.PackingGrid.PackingGridOptions["weightPriority"]}
 * @default "custom"
 * @example
 * ```js
 * import { PackingGrid } from "@egjs/grid";
 *
 * const grid = new PackingGrid(container, {
 *   weightPriority: "custom",
 *   sizeWeight: 1,
 *   ratioWeight: 1,
 * });
 *
 * grid.weightPriority = "size";
 * // or
 * grid.weightPriority = "ratio";
 * ```
 */

/**
 * The size weight when placing items.
 * @ko 아이템들을 배치하는데 사이즈 가중치.
 * @name Grid.PackingGrid#sizeWeight
 * @type {$ts:Grid.PackingGrid.PackingGridOptions["sizeWeight"]}
 * @default 1
 * @example
 * ```js
 * import { PackingGrid } from "@egjs/grid";
 *
 * const grid = new PackingGrid(container, {
 *   sizeWeight: 1,
 * });
 *
 * grid.sizeWeight = 10;
 * ```
 */


/**
 * The weight to keep ratio when placing items.
 * @ko 아이템들을 배치하는데 비율을 유지하는 가중치.
 * @name Grid.PackingGrid#ratioWeight
 * @type {$ts:Grid.PackingGrid.PackingGridOptions["ratioWeight"]}
 * @default 1
 * @example
 * ```js
 * import { PackingGrid } from "@egjs/grid";
 *
 * const grid = new PackingGrid(container, {
 *   ratioWeight: 1,
 * });
 *
 * grid.ratioWeight = 10;
 * ```
 */
