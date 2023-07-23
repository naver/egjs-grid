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
  childrenRectBox?: "border-box" | "content-box";
}

export interface ResizeWatcherResizeEvent {
  isResizeContainer: boolean;
  childEntries: ResizeWatcherEntry[];
}

export interface ResizeWatcherEntry {
  target: Element;
  size?: { inlineSize: number, blockSize: number };
}

export class ResizeWatcher {
  private _resizeTimer = 0;
  private _maxResizeDebounceTimer = 0;
  private _emitter: Component<{ resize: ResizeWatcherResizeEvent }>;
  private _observer: ResizeObserver | null;
  protected container: HTMLElement;
  protected rect: SizeRect = { width: 0, height: 0 };
  private _options!: Required<ResizeWatherOptions>;
  private _updatedEntries: ResizeWatcherEntry[] = [];

  constructor(container: HTMLElement | string, options: ResizeWatherOptions = {}) {
    this._options = {
      resizeDebounce: 100,
      maxResizeDebounce: 0,
      useResizeObserver: false,
      useWindowResize: true,
      watchDirection: false,
      rectBox: "content-box",
      childrenRectBox: "border-box",
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
  public isObserverEnabled() {
    return !!this._observer;
  }
  public resize() {
    const container = this.container;

    this.setRect(this._options.rectBox === "border-box" ? {
      width: container.offsetWidth,
      height: container.offsetHeight,
    } : {
      width: container.clientWidth,
      height: container.clientHeight,
    });
  }
  public observeChildren(children: Element[]) {
    const observer = this._observer;

    if (!observer) {
      return;
    }
    const box = this._options.childrenRectBox;

    children.forEach((element) => {
      observer.observe(element, {
        box,
      });
    });
  }
  public unobserveChildren(children: Element[]) {
    const observer = this._observer;

    if (!observer) {
      return;
    }
    children.forEach((element) => {
      observer.unobserve(element);
    });
  }
  public listen(callback: (e: ResizeWatcherResizeEvent) => void) {
    this._emitter.on("resize", callback);
    return this;
  }
  public destroy() {
    this._observer?.disconnect();
    if (this._options.useWindowResize) {
      window.removeEventListener("resize", this._onWindowResize);
    }
  }
  private _init() {
    const container = this.container;
    const options = this._options;

    this._emitter = new Component();
    if (options.useResizeObserver && !!window.ResizeObserver) {
      this._observer = new window.ResizeObserver(this._onObserve);
      this._observer.observe(container, {
        box: options.rectBox,
      });
    }
    if (options.useWindowResize) {
      window.addEventListener("resize", this._onWindowResize);
    }
    this.resize();
  }
  private _onWindowResize = () => {
    this._scheduleResize([{
      target: this.container,
    }]);
  }
  private _onObserve = (entries: ResizeObserverEntry[]) => {
    const options = this._options;
    const container = this.container;
    const containerRectBox = options.rectBox;
    const childrenRectBox = options.childrenRectBox;

    this._scheduleResize(entries.map((entry) => {
      const target = entry.target;
      const rectBox = target === container ? containerRectBox : childrenRectBox;
      let sizes = (rectBox === "border-box" ? entry.borderBoxSize : entry.contentBoxSize);

      // Safari < 15.3
      if (!sizes) {
        const contentRect = entry.contentRect;

        sizes = [{
          inlineSize: contentRect.width,
          blockSize: contentRect.height,
        }];
      }
      return {
        // not array in old browser
        size: sizes[0] || sizes as any,
        target: entry.target,
      };
    }));
  }
  private _scheduleResize = (entries: ResizeWatcherEntry[]) => {
    const {
      resizeDebounce,
      maxResizeDebounce,
    } = this._options;

    const updatedEntries = this._updatedEntries;

    updatedEntries.push(...entries);
    this._updatedEntries = updatedEntries.filter((entry, index) => {
      return updatedEntries.lastIndexOf(entry) === index;
    });


    if (!this._maxResizeDebounceTimer && maxResizeDebounce >= resizeDebounce) {
      this._maxResizeDebounceTimer = window.setTimeout(this._onResize, maxResizeDebounce);
    }
    if (this._resizeTimer) {
      clearTimeout(this._resizeTimer);
      this._resizeTimer = 0;
    }
    this._resizeTimer = window.setTimeout(this._onResize, resizeDebounce);
  }
  private _onResize = () => {
    clearTimeout(this._resizeTimer);
    clearTimeout(this._maxResizeDebounceTimer);

    this._maxResizeDebounceTimer = 0;
    this._resizeTimer = 0;

    const updated = this._updatedEntries;
    const container = this.container;
    let containerEntry!: ResizeWatcherEntry;
    const childEntries = updated.filter((entry) => {
      if (entry.target === container) {
        containerEntry = entry;
        return false;
      } else {
        return true;
      }
    });
    const isResizeChildren = childEntries.length > 0;
    let isResizeContainer = !!containerEntry;

    if (isResizeContainer) {
      const watchDirection = this._options.watchDirection;
      const prevRect = this.rect;
      const containerEntrySize = containerEntry.size;

      if (containerEntrySize) {
        // ResizeObserver
        this.setRect({
          width: containerEntrySize.inlineSize,
          height: containerEntrySize.blockSize,
        });
      } else {
        // window's resize event
        this.resize();
      }
      const rect = this.rect;
      const isWatchWidth = watchDirection === "box" || watchDirection === "width";
      const isWatchHeight = watchDirection === "box" || watchDirection === "height";

      isResizeContainer = !watchDirection
        || (isWatchWidth && prevRect.width !== rect.width)
        || (isWatchHeight && prevRect.height !== rect.height);
    }
    this._updatedEntries = [];

    if (isResizeContainer || isResizeChildren) {
      this._emitter.trigger("resize", {
        isResizeContainer,
        childEntries,
      });
    }
  }
}
