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
  initialRects: Record<string, Required<DOMRect>>;
}

export class ItemRenderer {
  protected options: Required<ItemRendererOptions>;
  protected containerRect: DOMRect;
  protected initialRects: Record<string, Required<DOMRect>> = {};
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
    this.initialRects = {};
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
  public updateEqualSizeItems(items: GridItem[], totalItems: GridItem[]) {
    this.updateItems(items);

    const hasSizeGroup = items.some((item) => item.attributes.sizeGroup);

    // Check the rest of the items(totalItems) except `items`.
    if (this.options.isEqualSize || hasSizeGroup) {
      const updatedItem = items.some((item) => item.updateState === UPDATE_STATE.UPDATED);

      if (updatedItem) {
        totalItems.forEach((item) => {
          if (items.indexOf(item) === -1) {
            this.updateItem(item, true);
          }
        });
      }
    }
  }
  public updateItems(items: GridItem[]) {
    items.forEach((item) => {
      this.updateItem(item);
    });
  }
  public getStatus(): ItemRendererStatus {
    return {
      initialRects: this.initialRects,
    };
  }
  public setStatus(status: ItemRendererStatus) {
    this.initialRects = status.initialRects;
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
  public updateItem(item: GridItem, checkSizeGroup?: boolean) {
    const { isEqualSize, isConstantSize, useRoundedSize } = this.options;
    const initialRects = this.initialRects;
    const { orgRect, element } = item;
    const isLoading = item.updateState === UPDATE_STATE.WAIT_LOADING;
    const hasOrgSize = orgRect && orgRect.width && orgRect.height;
    let rect: Required<DOMRect>;

    const attributes: Record<string, string> = element
      ? getDataAttributes(element, this.options.attributePrefix)
      : item.attributes;
    const sizeGroup = attributes.sizeGroup ?? "";
    const isNotEqualSize = attributes.notEqualSize;

    if (sizeGroup !== "" && initialRects[sizeGroup]) {
      rect = initialRects[sizeGroup];
    } else if (isEqualSize && !isNotEqualSize && !sizeGroup && initialRects[""]) {
      rect = initialRects[""];
    } else if (isConstantSize && hasOrgSize && !isLoading) {
      rect = orgRect;
    } else if (checkSizeGroup || !element) {
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
    item.attributes = attributes;
    item.shouldReupdate = false;

    if (!item.isFirstUpdate || !hasOrgSize) {
      item.orgRect = { ...rect };
    }
    item.rect = { ...rect };

    // If it's equal size items, it doesn't affect the state.
    if (!checkSizeGroup) {
      if (item.element) {
        item.mountState = MOUNT_STATE.MOUNTED;
      }

      if (item.updateState === UPDATE_STATE.NEED_UPDATE) {
        item.updateState = UPDATE_STATE.UPDATED;
        item.isFirstUpdate = true;
      }
      if (!isLoading && !isNotEqualSize && !initialRects[sizeGroup]) {
        initialRects[sizeGroup] = { ...rect };
      }
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
    } = RECT_NAMES[horizontal ? "horizontal" : "vertical"];
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
