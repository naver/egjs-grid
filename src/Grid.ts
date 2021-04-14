/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import Component from "@egjs/component";
import { DEFAULT_GRID_OPTIONS, GRID_PROPERTY_TYPES, MOUNT_STATE, UPDATE_STATE } from "./consts";
import { ContainerManager } from "./ContainerManager";
import {
  DestroyOptions, GridEvents, GridOptions,
  GridOutlines, GridStatus, Properties, RenderOptions,
  OnRenderComplete,
} from "./types";
import ImReady from "@egjs/imready";
import { ItemRenderer } from "./ItemRenderer";
import { GetterSetter, isNumber, isString } from "./utils";
import { diff } from "@egjs/children-differ";
import { GridItem } from "./GridItem";

/**
 * @extends eg.Component
 */
@GetterSetter
abstract class Grid<Options extends GridOptions = GridOptions> extends Component<GridEvents> {
  public static defaultOptions: Required<GridOptions> = DEFAULT_GRID_OPTIONS;
  public static propertyTypes = GRID_PROPERTY_TYPES;
  public options: Required<Options>;
  protected containerElement: HTMLElement;
  protected containerManager: ContainerManager;
  protected itemRenderer!: ItemRenderer;
  protected items: GridItem[] = [];
  protected outlines: GridOutlines = {
    start: [],
    end: [],
  };
  private _renderTimer = 0;
  private _resizeTimer = 0;
  private _maxResizeDebounceTimer = 0;
  private _im: ImReady;

  /**
  * Apply the CSS rect of items to fit the Grid and calculate the outline.
  * @ko  Grid에 맞게 아이템들의 CSS rect를 적용하고 outline을 계산한다.
  * @abstract
  * @method Grid#applyGrid
  * @param {"start" | "end"} direcion - The direction to apply the Grid. ("end": start to end, "start": end to start) <ko>Grid를 적용할 방향. ("end": 시작에서 끝 방향, "start": 끝에서 시작 방향)</ko>
  * @param {number[]} outline - The start outline to apply the Grid. <ko>Grid를 적용할 시작 outline.</ko>
  */
  public abstract applyGrid(items: GridItem[], direction: "start" | "end", outline: number[]): GridOutlines;

  /**
   * @param - A base element for a module <ko>모듈을 적용할 기준 엘리먼트</ko>
   * @param - The option object of the Grid module <ko>Grid 모듈의 옵션 객체</ko>
   */
  constructor(containerElement: HTMLElement | string, options: Partial<Options> = {}) {
    super();

    this.options = {
      ...((this.constructor as typeof Grid)
        .defaultOptions as Required<Options>),
      ...options,
    };

    this.containerElement = isString(containerElement)
      ? document.querySelector<HTMLElement>(containerElement)!
      : containerElement;

    const {
      isEqualSize,
      isConstantSize,
      useTransform,
      horizontal,
      percentage,
      externalContainerManager,
      externalItemRenderer,
    } = this.options;

    // TODO: 테스트용 설정
    this.containerManager = externalContainerManager!
      || new ContainerManager(this.containerElement, {
        horizontal,
      });
    this.itemRenderer = externalItemRenderer!
      || new ItemRenderer({
        useTransform,
        isEqualSize,
        isConstantSize,
        percentage,
      });

    this._init();
  }
  /**
   * Return items.
   * @ko 아이템들을 반환한다.
   */
  public getItems(): GridItem[] {
    return this.items;
  }
  /**
   * Returns the children of the container element.
   * @ko 컨테이너 엘리먼트의 children을 반환한다.
   */
  public getChildren(): HTMLElement[] {
    return [].slice.call(this.containerElement.children);
  }
  /**
   * Set items.
   * @ko 아이템들을 설정한다.
   * @param items - The items to set. <ko>설정할 아이템들</ko>
   */
  public setItems(items: GridItem[]): this {
    this.items = items;
    return this;
  }
  /**
   * Gets the container's inline size. ("width" if horizontal is false, otherwise "height")
   * @ko container의 inline 사이즈를 가져온다. (horizontal이 false면 "width", 아니면 "height")
   */
  public getContainerInlineSize(): number {
    return this.containerManager.getInlineSize()!;
  }
  /**
   * Returns the outlines of the start and end of the Grid.
   * @ko Grid의 처음과 끝의 outline을 반환한다.
   */
  public getOutlines(): GridOutlines {
    return this.outlines;
  }
  /**
   * Set outlines.
   * @ko 아웃라인을 설정한다.
   * @param outlines - The outlines to set. <ko>설정할 아웃라인.</ko>
   */
  public setOutlines(outlines: GridOutlines) {
    this.outlines = outlines;
    return this;
  }
  /**
   * When elements change, it synchronizes and renders items.
   * @ko elements가 바뀐 경우 동기화를 하고 렌더링을 한다.
   * @param - Options for rendering. <ko>렌더링을 하기 위한 옵션.</ko>
   */
  public syncElements(options: RenderOptions = {}) {
    const items = this.items;
    const horizontal = this.options.horizontal;
    const elements: HTMLElement[] = this.getChildren();
    const { added, maintained, changed, removed } = diff(this.items.map((item) => item.element!), elements);

    const nextItems: GridItem[] = [];

    maintained.forEach(([beforeIndex, afterIndex]) => {
      nextItems[afterIndex] = items[beforeIndex];
    });
    added.forEach((index) => {
      nextItems[index] = new GridItem(horizontal!, {
        element: elements[index],
      });
    });

    this.setItems(nextItems);

    if (added.length || removed.length || changed.length) {
      this.renderItems(options);
    }
    return this;
  }
  /**
   * Update the size of the items and render them.
   * @ko 아이템들의 사이즈를 업데이트하고 렌더링을 한다.
   * @param - Items to be updated. <ko>업데이트할 아이템들.</ko>
   * @param - Options for rendering. <ko>렌더링을 하기 위한 옵션.</ko>
   */
  public updateItems(items: GridItem[] = this.items, options: RenderOptions = {}) {
    items.forEach((item) => {
      item.updateState = UPDATE_STATE.NEED_UPDATE;
    });
    this.checkReady(options);
    return this;
  }
  /**
   * Rearrange items to fit the grid and render them. When rearrange is complete, the `renderComplete` event is fired.
   * @ko grid에 맞게 아이템을 재배치하고 렌더링을 한다. 배치가 완료되면 `renderComplete` 이벤트가 발생한다.
   * @param - Options for rendering. <ko>렌더링을 하기 위한 옵션.</ko>
   * @example
   * import { MasonryGrid } from "@egjs/grid";
   * const grid = new MasonryGrid();
   *
   * grid.on("renderComplete", e => {
   *   console.log(e);
   * });
   * grid.renderItems();
   */
  public renderItems(options: RenderOptions = {}) {
    this._clearRenderTimer();

    if (!this.getItems().length && this.getChildren().length) {
      this.syncElements(options);
    } else if (options.useResize) {
      // Resize container and Update all items
      this._resizeContainer();
      this.updateItems(this.items, options);
    } else {
      // Update only items that need to be updated.
      this.checkReady(options);
    }
    return this;
  }
  /**
   * Returns current status such as item's position, size. The returned status can be restored with the setStatus() method.
   * @ko 아이템의 위치, 사이즈 등 현재 상태를 반환한다. 반환한 상태는 setStatus() 메서드로 복원할 수 있다.
   */
  public getStatus(): GridStatus {
    return {
      outlines: this.outlines,
      items: this.items.map((item) => item.getStatus()),
      containerManager: this.containerManager.getStatus(),
      itemRenderer: this.itemRenderer.getStatus(),
    };
  }
  /**
   * Set status of the Grid module with the status returned through a call to the getStatus() method.
   * @ko getStatus() 메서드에 대한 호출을 통해 반환된 상태로 Grid 모듈의 상태를 설정한다.
   */
  public setStatus(status: GridStatus) {
    const horizontal = this.options.horizontal;
    const containerManager = this.containerManager;
    const prevInlineSize = containerManager.getInlineSize();
    const children = this.getChildren();

    this.itemRenderer.setStatus(status.itemRenderer);
    containerManager.setStatus(status.containerManager);
    this.outlines = status.outlines;
    this.items = status.items.map((item, i) => new GridItem(horizontal!, {
      ...item,
      element: children[i],
    }));

    this.itemRenderer.renderItems(this.items);

    if (prevInlineSize !== containerManager.getInlineSize()) {
      this.renderItems({
        useResize: true,
      });
    } else {
      window.setTimeout(() => {
        this._renderComplete({
          mounted: this.items,
          updated: [],
          isResize: false,
        });
      });
    }
    return this;
  }
  /**
   * Releases the instnace and events and returns the CSS of the container and elements.
   * @ko 인스턴스와 이벤트를 해제하고 컨테이너와 엘리먼트들의 CSS를 되돌린다.
   * @param Options for destroy. <ko>destory()를 위한 옵션</ko>
   */
  public destroy(options: DestroyOptions = {}) {
    const {
      preserveUI = this.options.preserveUIOnDestroy,
    } = options;
    this.containerManager.destroy({
      preserveUI,
    });

    if (!preserveUI) {
      this.items.forEach(({ element, orgCSSText }) => {
        if (element) {
          element.style.cssText = orgCSSText;
        }
      });
    }
    window.removeEventListener("resize", this._scheduleResize);
    this._im?.destroy();
  }
  protected checkReady(options: RenderOptions = {}) {
    // Grid: renderItems => checkItems => _renderItems
    const items = this.items;
    const updated = items.filter((item) => item.element && item.updateState !== UPDATE_STATE.UPDATED);
    const mounted: GridItem[] = updated.filter((item) => item.mountState !== MOUNT_STATE.MOUNTED);
    const moreUpdated: GridItem[] = [];

    this._im?.destroy();
    this._im = new ImReady({
      prefix: this.options.attributePrefix,
    }).on("preReadyElement", (e) => {
      if (e.hasLoading) {
        updated[e.index].updateState = UPDATE_STATE.WAIT_LOADING;
      }
    }).on("preReady", () => {
      this.itemRenderer.updateItems(updated);
      this._renderItems(mounted, updated, options);
    }).on("readyElement", (e) => {
      const item = updated[e.index];
      if (e.hasLoading) {
        item.updateState = UPDATE_STATE.NEED_UPDATE;

        if (e.isPreReadyOver) {
          this.itemRenderer.updateItems([item]);
          this._renderItems([], [item], options);
        }
      }
    }).on("error", (e) => {
      const item = items[e.index];
      /**
       * This event is fired when an error occurs in the content.
       * @ko 콘텐츠 로드에 에러가 날 때 발생하는 이벤트.
       * @event Grid#contentError
       * @param {Grid.OnContentError} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
       * @param {HTMLElement} [e.element] - The item's element.<ko>아이템의 엘리먼트.</ko>
       * @param {HTMLElement} [e.target] - The content element with error.<ko>에러난 발생한 콘텐츠 엘리먼트.</ko>
       * @param {Grid.GridItem} [e.item] - The item with error content.<ko>에러난 콘텐츠를 가지고 있는 아이템</ko>
       * @param {function} [e.update] - If you have fixed the error and want to recheck it, call update(). If you remove an element, call the syncElements() method.<ko>에러를 해결했고 재검사하고 싶으면 update()를 호출해라. 만약 엘리먼트를 삭제한 경우 syncElements() 메서드를 호출해라.</ko>
       * @example
grid.on("contentError", e => {
  e.update();
});
      */
      this.trigger("contentError", {
        element: e.element,
        target: e.target,
        item,
        update: () => {
          moreUpdated.push(item);
        },
      });
    }).on("ready", () => {
      if (moreUpdated.length) {
        this.updateItems(moreUpdated);
      }
    }).check(updated.map((item) => item.element!));
  }

  protected scheduleRender() {
    this._clearRenderTimer();
    this._renderTimer = window.setTimeout(() => {
      this.renderItems();
    });
  }
  private _fit() {
    const outlines = this.outlines;
    const startOutline = outlines.start;
    const endOutline = outlines.end;
    const outlineOffset = startOutline.length ? Math.min(...startOutline) : 0;

    outlines.start = startOutline.map((point) => point - outlineOffset);
    outlines.end = endOutline.map((point) => point - outlineOffset);

    this.items.forEach((item) => {
      const contentPos = item.cssContentPos;

      if (!isNumber(contentPos)) {
        return;
      }
      item.cssContentPos = contentPos - outlineOffset;
    });
  }
  private _renderItems(mounted: GridItem[], updated: GridItem[], options: RenderOptions) {
    const prevOutlines = this.outlines;
    const direction = options.direction || this.options.defaultDirection!;
    const prevOutline = options.outline || prevOutlines[direction === "end" ? "start" : "end"];
    const items = this.items;
    let nextOutlines = {
      start: [...prevOutline],
      end: [...prevOutline],
    };
    if (items.length) {
      nextOutlines = this.applyGrid(this.items, direction, prevOutline);
    }
    this.setOutlines(nextOutlines);
    this._fit();
    this.itemRenderer.renderItems(this.items);
    this._refreshContainerContentSize();
    this._renderComplete({
      mounted,
      updated,
      isResize: !!options.useResize,
    });
  }
  private _renderComplete(e: OnRenderComplete) {
    /**
     * This event is fired when the Grid has completed rendering.
     * @ko Grid가 렌더링이 완료됐을 때  발생하는 이벤트이다.
     * @event Grid#renderComplete
     * @param {Grid.OnRenderComplete} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
     * @param {function} [e.mounted] - The items rendered for the first time <ko>처음 렌더링한 아이템들</ko>
     * @param {function} [e.updated] - The items updated in size.<ko>사이즈 업데이트한 아이템들.</ko>
     * @param {function} [e.useResize] - Whether rendering was done using the resize event or the useResize option. <ko>resize 이벤트 또는 useResize 옵션을 사용하여 렌더링를 했는지 여부.</ko>
     * @example
grid.on("renderComplete", e => {
console.log(e.mounted, e.updated, e.useResize);
});
      */
    this.trigger("renderComplete", e);
  }
  private _clearRenderTimer() {
    clearTimeout(this._renderTimer);
    this._renderTimer = 0;
  }
  private _refreshContainerContentSize() {
    const {
      start: startOutline,
      end: endOutline,
    } = this.outlines;
    const gap = this.options.gap!;

    const endPoint = endOutline.length ? Math.max(...endOutline) : 0;
    const startPoint = startOutline.length ? Math.max(...startOutline) : 0;
    const contentSize = Math.max(startPoint, endPoint - gap);

    this.containerManager.setContentSize(contentSize);
  }
  private _resizeContainer() {
    this.containerManager.resize();
    this.itemRenderer.setContainerRect(this.containerManager.getRect());
  }
  private _onResize = () => {
    clearTimeout(this._resizeTimer);
    clearTimeout(this._maxResizeDebounceTimer);

    this._maxResizeDebounceTimer = 0;
    this._resizeTimer = 0;
    this.renderItems({
      useResize: true,
    });
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

  private _init() {
    this._resizeContainer();
    if (this.options.autoResize) {
      window.addEventListener("resize", this._scheduleResize);
    }
  }
}

interface Grid extends Properties<typeof Grid> { }

export default Grid;

/**
 * Gap used to create space around items.
 * @ko 아이템들 사이의 공간.
 * @name Grid#gap
 * @type {$ts:Grid.GridOptions["gap"]}
 * @example
 * import { MasonryGrid } from "@egjs/grid";
 *
 * const grid = new MasonryGrid(container, {
 *   gap: 0,
 * });
 *
 * grid.gap = 5;
 */

/**
 * The default direction value when direction is not set in the render option.
 * @ko render옵션에서 direction을 미설정시의 기본 방향값.
 * @name Grid#defaultDirection
 * @type {$ts:Grid.GridOptions["defaultDirection"]}
 * @example
 * import { MasonryGrid } from "@egjs/grid";
 *
 * const grid = new MasonryGrid(container, {
 *   defaultDirection: "end",
 * });
 *
 * grid.defaultDirection = "start";
 */

/**
 * Whether to preserve the UI of the existing container or item when destroying.
 * @ko destroy 시 기존 컨테이너, 아이템의 UI를 보존할지 여부.
 * @name Grid#preserveUIOnDestroy
 * @type {$ts:Grid.GridOptions["preserveUIOnDestroy"]}
 * @example
 * import { MasonryGrid } from "@egjs/grid";
 *
 * const grid = new MasonryGrid(container, {
 *   preserveUIOnDestroy: false,
 * });
 *
 * grid.preserveUIOnDestroy = true;
 */
