/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import { DestroyOptions } from ".";
import { DEFAULT_GRID_OPTIONS } from "./consts";
import { DOMRect } from "./types";

export interface ContainerManagerOptions {
  horizontal?: boolean;
}

export interface ContainerManagerStatus {
  rect: DOMRect;
}

export class ContainerManager {
  protected options: Required<ContainerManagerOptions>;
  protected rect: DOMRect;
  protected orgCSSText: string;

  constructor(protected container: HTMLElement, options: ContainerManagerOptions) {
    this.options = {
      horizontal: DEFAULT_GRID_OPTIONS.horizontal,
      ...options,
    };

    this._init();
  }
  public resize() {
    const container = this.container;

    this.setRect({
      width: container.clientWidth,
      height: container.clientHeight,
    });
  }
  public getRect() {
    return this.rect;
  }
  public setRect(rect: DOMRect) {
    this.rect = { ...rect };
  }
  public getInlineSize() {
    return this.rect[this.options.horizontal ? "height" : "width"];
  }
  public getContentSize() {
    return this.rect[this.options.horizontal ? "width" : "height"]!;
  }
  public getStatus() {
    return {
      rect: { ...this.rect },
    };
  }
  public setStatus(status: ContainerManagerStatus) {
    this.rect = { ...status.rect };

    this.setContentSize(this.getContentSize());
  }
  public setContentSize(size: number) {
    const sizeName = this.options.horizontal ? "width" : "height";
    this.rect[sizeName] = size;
    this.container.style[sizeName] = `${size}px`;
  }
  public destroy(options: DestroyOptions = {}) {
    if (!options.preserveUI) {
      this.container.style.cssText = this.orgCSSText;
    }
  }
  private _init() {
    const container = this.container;
    const style = window.getComputedStyle(container);

    this.orgCSSText = container.style.cssText;

    if (style.position === "static") {
      container.style.position = "relative";
    }
  }
}
