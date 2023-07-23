/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import Component from "@egjs/component";
import { DestroyOptions, SizeRect } from "./types";
import { ResizeWatcherResizeEvent, ResizeWatcher } from "./ResizeWatcher";
import { DEFAULT_GRID_OPTIONS, RECT_NAMES } from "./consts";

export interface ContainerManagerOptions {
  horizontal?: boolean;
  autoResize?: boolean;
  resizeDebounce?: number;
  maxResizeDebounce?: number;
  useResizeObserver?: boolean;
}

export interface ContainerManagerStatus {
  rect: SizeRect;
}
export interface ContainerManagerEvents {
  resize: ResizeWatcherResizeEvent;
}
export class ContainerManager extends Component<ContainerManagerEvents> {
  protected options: Required<ContainerManagerOptions>;
  protected orgCSSText: string;
  protected _watcher: ResizeWatcher;

  constructor(protected container: HTMLElement, options: ContainerManagerOptions) {
    super();
    this.options = {
      horizontal: DEFAULT_GRID_OPTIONS.horizontal,
      autoResize: DEFAULT_GRID_OPTIONS.autoResize,
      resizeDebounce: DEFAULT_GRID_OPTIONS.resizeDebounce,
      maxResizeDebounce: DEFAULT_GRID_OPTIONS.maxResizeDebounce,
      useResizeObserver: DEFAULT_GRID_OPTIONS.useResizeObserver,
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
  public isObserverEnabled() {
    return this._watcher.isObserverEnabled();
  }
  public getRect() {
    return this._watcher.getRect();
  }
  public observeChildren(children: Element[]) {
    this._watcher.observeChildren(children);
  }
  public unobserveChildren(children: Element[]) {
    this._watcher.unobserveChildren(children);
  }
  public setRect(rect: SizeRect) {
    this._watcher.setRect(rect);
  }
  public getInlineSize() {
    return this.getRect()[this._names.inlineSize];
  }
  public getContentSize() {
    return this.getRect()[this._names.contentSize];
  }
  public getStatus() {
    return { rect: this._watcher.getRect() };
  }
  public setStatus(status: ContainerManagerStatus) {
    this.setRect(status.rect);
    this.setContentSize(this.getContentSize());
  }
  public setContentSize(size: number) {
    const sizeName = this.options.horizontal ? "width" : "height";
    this.setRect({
      ...this.getRect(),
      [sizeName]: size,
    });
    this.container.style[sizeName] = `${size}px`;
  }
  public destroy(options: DestroyOptions = {}) {
    this._watcher.destroy();

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
    const options = this.options;

    this._watcher = new ResizeWatcher(container, {
      useWindowResize: options.autoResize,
      useResizeObserver: options.useResizeObserver,
      resizeDebounce: options.resizeDebounce,
      maxResizeDebounce: options.maxResizeDebounce,
      watchDirection: options.useResizeObserver ? this._names.inlineSize : false,
    }).listen(this._onResize);
  }
  private _onResize = (e: ResizeWatcherResizeEvent) => {
    this.trigger("resize", e);
  }
  private get _names() {
    return RECT_NAMES[this.options.horizontal ? "horizontal" : "vertical"];
  }
}
