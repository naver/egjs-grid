/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import Component from "@egjs/component";
import { DestroyOptions } from ".";
import { DEFAULT_GRID_OPTIONS } from "./consts";
import { DOMRect } from "./types";

export interface ContainerManagerOptions {
  horizontal?: boolean;
  autoResize?: boolean;
  resizeDebounce?: number;
  maxResizeDebounce?: number;
}

export interface ContainerManagerStatus {
  rect: DOMRect;
}
export interface ContainerManagerEvents {
  resize: void;
}
export class ContainerManager extends Component<ContainerManagerEvents> {
  protected options: Required<ContainerManagerOptions>;
  protected rect: DOMRect;
  protected orgCSSText: string;
  private _resizeTimer = 0;
  private _maxResizeDebounceTimer = 0;

  constructor(protected container: HTMLElement, options: ContainerManagerOptions) {
    super();
    this.options = {
      horizontal: DEFAULT_GRID_OPTIONS.horizontal,
      autoResize: DEFAULT_GRID_OPTIONS.autoResize,
      resizeDebounce: DEFAULT_GRID_OPTIONS.resizeDebounce,
      maxResizeDebounce: DEFAULT_GRID_OPTIONS.maxResizeDebounce,
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
    window.removeEventListener("resize", this._scheduleResize);
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
    if (this.options.autoResize) {
      window.addEventListener("resize", this._scheduleResize);
    }
  }
  private _onResize = () => {
    clearTimeout(this._resizeTimer);
    clearTimeout(this._maxResizeDebounceTimer);

    this._maxResizeDebounceTimer = 0;
    this._resizeTimer = 0;

    this.trigger("resize");
  }
  private _scheduleResize = () => {
    const {
      resizeDebounce,
      maxResizeDebounce,
    } = this.options;


    if (!this._maxResizeDebounceTimer && maxResizeDebounce >= resizeDebounce) {
      this._maxResizeDebounceTimer = window.setTimeout(this._onResize, maxResizeDebounce);
    }
    if (this._resizeTimer) {
      clearTimeout(this._resizeTimer);
      this._resizeTimer = 0;
    }
    this._resizeTimer = window.setTimeout(this._onResize, resizeDebounce);
  }
}
