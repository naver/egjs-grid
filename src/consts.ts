/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import { GridOptions } from "./types";

export const DEFAULT_GRID_OPTIONS: Required<GridOptions> = {
  horizontal: false,
  useTransform: false,
  percentage: false,
  isEqualSize: false,
  isConstantSize: false,
  gap: 0,
  attributePrefix: "data-grid-",
  resizeDebounce: 100,
  maxResizeDebounce: 0,
  autoResize: true,
  preserveUIOnDestroy: false,
  defaultDirection: "end",
  externalContainerManager: null,
  externalItemRenderer: null,
  renderOnPropertyChange: true,
  useFit: true,
  outlineLength: 0,
  outlineSize: 0,
  useRoundedSize: true,
  useResizeObserver: false,
  observeChildren: false,
};

export enum PROPERTY_TYPE {
  PROPERTY = 1,
  RENDER_PROPERTY = 2,
}
export enum MOUNT_STATE {
  UNCHECKED = 1,
  UNMOUNTED = 2,
  MOUNTED = 3,
}
export enum UPDATE_STATE {
  NEED_UPDATE = 1,
  WAIT_LOADING = 2,
  UPDATED = 3,
}

export const GRID_PROPERTY_TYPES = {
  gap: PROPERTY_TYPE.RENDER_PROPERTY,
  defaultDirection: PROPERTY_TYPE.PROPERTY,
  renderOnPropertyChange: PROPERTY_TYPE.PROPERTY,
  preserveUIOnDestroy: PROPERTY_TYPE.PROPERTY,
  useFit: PROPERTY_TYPE.PROPERTY,
  outlineSize: PROPERTY_TYPE.RENDER_PROPERTY,
  outlineLength: PROPERTY_TYPE.RENDER_PROPERTY,
};

export const GRID_METHODS = [
  "syncElements",
  "updateItems",
  "getItems",
  "setItems",
  "renderItems",
  "getContainerInlineSize",
  "getContainerElement",
] as const;

export const GRID_EVENTS = [
  "renderComplete",
  "contentError",
] as const;

export const RECT_NAMES = {
  horizontal: {
    inlinePos: "top",
    contentPos: "left",
    inlineSize: "height",
    contentSize: "width",
  },
  vertical: {
    inlinePos: "left",
    contentPos: "top",
    inlineSize: "width",
    contentSize: "height",
  },
} as const;
