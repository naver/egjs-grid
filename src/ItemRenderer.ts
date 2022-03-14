/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import { DEFAULT_GRID_OPTIONS, MOUNT_STATE, RECT_NAMES, UPDATE_STATE } from "./consts";
import { GridItem } from "./GridItem";
import { DOMRect } from "./types";
import { getDataAttributes, getKeys } from "./utils";

export interface ItemRendererOptions {
  attributePrefix?: string;
  useTransform?: boolean;
  horizontal?: boolean;
  percentage?: Array<"position" | "size"> | boolean;
  isEqualSize?: boolean;
  isConstantSize?: boolean;
  useRoundedSize?: boolean;
}
export interface ItemRendererStatus {
  initialRect: Required<DOMRect> | null;
}

export class ItemRenderer {
  protected options: Required<ItemRendererOptions>;
  protected containerRect: DOMRect;
  protected initialRect: Required<DOMRect> | null = null;
  protected sizePercetage = false;
  protected posPercetage = false;

  constructor(options: ItemRendererOptions) {
    this.options = {
      attributePrefix: DEFAULT_GRID_OPTIONS.attributePrefix,
      useTransform: DEFAULT_GRID_OPTIONS.useTransform,
      horizontal: DEFAULT_GRID_OPTIONS.horizontal,
      percentage: DEFAULT_GRID_OPTIONS.percentage,
      isEqualSize: DEFAULT_GRID_OPTIONS.isEqualSize,
      isConstantSize: DEFAULT_GRID_OPTIONS.isConstantSize,
      useRoundedSize: DEFAULT_GRID_OPTIONS.useRoundedSize,
      ...options,
    };
    this._init();
  }
  public resize() {
    this.initialRect = null;
  }
  public renderItems(items: GridItem[]) {
    items.forEach((item) => {
      this._renderItem(item);
    });
  }
  public getInlineSize() {
    return this.containerRect[this.options.horizontal ? "height" : "width"]!;
  }
  public setContainerRect(rect: DOMRect) {
    this.containerRect = rect;
  }
  public updateItems(items: GridItem[]) {
    items.forEach((item) => {
      this._updateItem(item);
    });
  }
  public getStatus(): ItemRendererStatus {
    return {
      initialRect: this.initialRect,
    };
  }
  public setStatus(status: ItemRendererStatus) {
    this.initialRect = status.initialRect;
  }
  private _init() {
    const { percentage } = this.options;

    let sizePercentage = false;
    let posPercentage = false;

    if (percentage === true) {
      sizePercentage = true;
      posPercentage = true;
    } else if (percentage) {
      if (percentage.indexOf("position") > -1) {
        posPercentage = true;
      }
      if (percentage.indexOf("size") > -1) {
        sizePercentage = true;
      }
    }

    this.posPercetage = posPercentage;
    this.sizePercetage = sizePercentage;
  }
  private _updateItem(item: GridItem) {
    const { isEqualSize, isConstantSize, useRoundedSize } = this.options;
    const initialRect = this.initialRect;
    const { orgRect, element } = item;
    const isLoading = item.updateState === UPDATE_STATE.WAIT_LOADING;
    const hasOrgSize = orgRect && orgRect.width && orgRect.height;
    let rect: Required<DOMRect>;

    if (isEqualSize && initialRect) {
      rect = initialRect;
    } else if (isConstantSize && hasOrgSize && !isLoading) {
      rect = orgRect;
    } else if (!element) {
      return;
    } else {
      rect = {
        left: element.offsetLeft,
        top: element.offsetTop,
        width: 0,
        height: 0,
      };
      if (useRoundedSize) {
        rect.width = element.offsetWidth;
        rect.height = element.offsetHeight;
      } else {
        const clientRect = element.getBoundingClientRect();

        rect.width = clientRect.width;
        rect.height = clientRect.height;
      }
    }
    if (!item.isFirstUpdate || !hasOrgSize) {
      item.orgRect = { ...rect };
    }
    item.rect = { ...rect };

    if (item.element) {
      item.mountState = MOUNT_STATE.MOUNTED;
    }

    if (item.updateState === UPDATE_STATE.NEED_UPDATE) {
      item.updateState = UPDATE_STATE.UPDATED;
      item.isFirstUpdate = true;
    }
    item.attributes = element ? getDataAttributes(element, this.options.attributePrefix) : {};

    if (!isLoading && !this.initialRect) {
      this.initialRect = { ...rect };
    }

    return rect;
  }
  private _renderItem(item: GridItem) {
    const element = item.element;
    const cssRect = item.cssRect;

    if (!element || !cssRect) {
      return;
    }

    const {
      horizontal,
      useTransform,
    } = this.options;
    const posPercentage = this.posPercetage;
    const sizePercentage = this.sizePercetage;
    const cssTexts: string[] = ["position: absolute;"];
    const {
      inlineSize: sizeName,
      inlinePos: posName,
    } = RECT_NAMES[horizontal ? "horizontal": "vertical"];
    const inlineSize = this.getInlineSize();
    let keys = getKeys(cssRect);

    if (useTransform) {
      keys = keys.filter((key) => key !== "top" && key !== "left");

      cssTexts.push(`transform: `
        + `translate(${cssRect.left || 0}px, ${cssRect.top || 0}px);`
      );
    }
    cssTexts.push(...keys.map((name) => {
      const value = cssRect[name]!;

      if (
        (name === sizeName && sizePercentage) ||
        (name === posName && posPercentage)
      ) {
        return `${name}: ${(value / inlineSize) * 100}%;`;
      }
      return `${name}: ${value}px;`;
    }));

    element.style.cssText += cssTexts.join("");
  }
}
