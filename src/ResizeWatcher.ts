import Component from "@egjs/component";
import { SizeRect } from "./types";
import { isString } from "./utils";

export interface ResizeWatherOptions {
  resizeDebounce?: number;
  maxResizeDebounce?: number;
  useResizeObserver?: boolean;
  useWindowResize?: boolean;
  watchDirection?: "width" | "height" | "box" | false;
  rectBox?: "border-box" | "content-box";
}

export interface OnResize {

}


export class ResizeWatcher {
  private _resizeTimer = 0;
  private _maxResizeDebounceTimer = 0;
  private _emitter: Component<{ resize: OnResize }>;
  private _observer: ResizeObserver | null;
  protected container: HTMLElement;
  protected rect: SizeRect = { width: 0, height: 0 };
  protected options!: Required<ResizeWatherOptions>;

  constructor(container: HTMLElement | string, options: ResizeWatherOptions = {}) {
    this.options = {
      resizeDebounce: 100,
      maxResizeDebounce: 0,
      useResizeObserver: false,
      useWindowResize: true,
      watchDirection: false,
      rectBox: "content-box",
      ...options,
    };

    this.container = isString(container) ? document.querySelector<HTMLElement>(container)! : container;
    this._init();
  }
  public getRect() {
    return this.rect;
  }
  public setRect(rect: SizeRect) {
    this.rect = { ...rect };
  }
  public resize() {
    const container = this.container;

    this.setRect(this.options.rectBox === "border-box" ? {
      width: container.offsetWidth,
      height: container.offsetHeight,
    } : {
      width: container.clientWidth,
      height: container.clientHeight,
    });
  }
  public listen(callback: (e: OnResize) => void) {
    this._emitter.on("resize", callback);
    return this;
  }
  public destroy() {
    this._observer?.disconnect();
    if (this.options.useWindowResize) {
      window.removeEventListener("reisze", this._onResize);
    }
  }
  private _init() {
    const container = this.container;
    const options = this.options;

    this._emitter = new Component();
    if (options.useResizeObserver && !!window.ResizeObserver) {
      this._observer = new window.ResizeObserver(this._scheduleResize);
      this._observer.observe(container, {
        box: options.rectBox,
      });
    }
    if (options.useWindowResize) {
      window.addEventListener("resize", this._scheduleResize);
    }
    this.resize();
  }
  private _onResize = () => {
    clearTimeout(this._resizeTimer);
    clearTimeout(this._maxResizeDebounceTimer);

    this._maxResizeDebounceTimer = 0;
    this._resizeTimer = 0;

    const watchDirection = this.options.watchDirection;
    const prevRect = this.rect;
    this.resize();
    const rect = this.rect;
    const isWatchWidth = watchDirection === "box" || watchDirection === "width";
    const isWatchHeight = watchDirection === "box" || watchDirection === "height";
    const isResize = !watchDirection
      || (isWatchWidth && prevRect.width !== rect.width)
      || (isWatchHeight && prevRect.height !== rect.height);

    if (isResize) {
      this._emitter.trigger("resize", {});
    }
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
