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
import { GetterSetter, getMountedElements, isNumber, isString, getUpdatedItems } from "./utils";
import { diff } from "@egjs/children-differ";
import { GridItem } from "./GridItem";
import { ResizeWatcherResizeEvent } from "./ResizeWatcher";

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
      resizeDebounce,
      maxResizeDebounce,
      autoResize,
      useRoundedSize,
      useResizeObserver,
    } = this.options;

    // TODO: 테스트용 설정
    this.containerManager = externalContainerManager!
      || new ContainerManager(this.containerElement, {
        horizontal,
        resizeDebounce,
        maxResizeDebounce,
        autoResize,
        useResizeObserver,
      }).on("resize", this._onResize);
    this.itemRenderer = externalItemRenderer!
      || new ItemRenderer({
        useTransform,
        isEqualSize,
        isConstantSize,
        percentage,
        useRoundedSize,
      });

    this._init();
  }
  /**
   * Return Container Element.
   * @ko 컨테이너 엘리먼트를 반환한다.
   */
  public getContainerElement(): HTMLElement {
    return this.containerElement;
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
    const options = this.options;

    if (options.useResizeObserver && options.observeChildren) {
      const containerManager = this.containerManager;

      containerManager.unobserveChildren(getMountedElements(this.items));
      containerManager.observeChildren(getMountedElements(items));
    }
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
    const { horizontal } = this.options;
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
    const useOrgResize = options.useOrgResize;

    items.forEach((item) => {
      if (useOrgResize) {
        const orgRect = item.orgRect;

        orgRect.width = 0;
        orgRect.height = 0;
      }
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
   * ```js
   * import { MasonryGrid } from "@egjs/grid";
   * const grid = new MasonryGrid();
   *
   * grid.on("renderComplete", e => {
   *   console.log(e);
   * });
   * grid.renderItems();
   * ```
   */
  public renderItems(options: RenderOptions = {}) {
    this._renderItems(options);
    return this;
  }
  /**
   * Returns current status such as item's position, size. The returned status can be restored with the setStatus() method.
   * @ko 아이템의 위치, 사이즈 등 현재 상태를 반환한다. 반환한 상태는 setStatus() 메서드로 복원할 수 있다.
   * @param - Whether to minimize the status of the item. (default: false) <ko>item의 status를 최소화할지 여부. (default: false)</ko>
   */
  public getStatus(minimize?: boolean): GridStatus {
    return {
      outlines: this.outlines,
      items: this.items.map((item) => minimize ? item.getMinimizedStatus() : item.getStatus()),
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
          direction: this.defaultDirection,
          mounted: this.items,
          updated: [],
          isResize: false,
        });
      });
    }
    return this;
  }
  /**
   * Get the inline size corresponding to outline.
   * @ko outline에 해당하는 inline 사이즈를 구한다.
   * @param items - Items to get outline size. <ko>outline 사이즈를 구하기 위한 아이템들.</ko>
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getComputedOutlineSize(items: GridItem[] = this.items) {
    return this.options.outlineSize! || this.getContainerInlineSize();
  }
  /**
   * Get the length corresponding to outline.
   * @ko outline에 해당하는 length를 가져온다.
   * @param items - Items to get outline length. <ko>outline length를 구하기 위한 아이템들.</ko>
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getComputedOutlineLength(items: GridItem[] = this.items): number {
    return this.options.outlineLength! || 1;
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

    this._im?.destroy();
  }

  protected checkReady(options: RenderOptions = {}) {
    // Grid: renderItems => checkReady => readyItems => applyGrid
    const items = this.items;
    const updated = items.filter((item) => item.element?.parentNode && item.updateState !== UPDATE_STATE.UPDATED);
    const mounted = items.filter((item) => item.element?.parentNode && item.mountState !== MOUNT_STATE.MOUNTED);
    const moreUpdated: GridItem[] = [];

    mounted.filter((item) => {
      if (item.hasTransition) {
        return true;
      } else {
        const element = item.element!;
        const transitionDuration = parseFloat(getComputedStyle(element).transitionDuration);

        if (transitionDuration > 0) {
          item.hasTransition = true;
          item.transitionDuration = element.style.transitionDuration;
          return true;
        }
      }
      return false;
    }).forEach((item) => {
      item.element!.style.transitionDuration = "0s";
    });
    this._im?.destroy();
    this._im = new ImReady({
      prefix: this.options.attributePrefix,
    }).on("preReadyElement", (e) => {
      updated[e.index].updateState = UPDATE_STATE.WAIT_LOADING;
    }).on("preReady", () => {
      // reset org size
      updated.forEach((item) => {
        const hasOrgSize = item.orgRect.width && item.orgRect.height;
        const hasCSSSize = item.cssRect.width || item.cssRect.height;

        if (!hasOrgSize && hasCSSSize) {
          item.element!.style.cssText = item.orgCSSText;
        }
      });
      this._updateItems(updated);
      this.readyItems(mounted, updated, options);
    }).on("readyElement", (e) => {
      const item = updated[e.index];

      item.updateState = UPDATE_STATE.NEED_UPDATE;
      // after preReady
      if (e.isPreReadyOver) {
        if (item.isRestoreOrgCSSText) {
          item.element!.style.cssText = item.orgCSSText;
        }
        this._updateItems([item]);
        this.readyItems([], [item], options);
      }
    }).on("error", (e) => {
      const item = updated[e.index];
      /**
       * This event is fired when an error occurs in the content.
       * @ko 콘텐츠 로드에 에러가 날 때 발생하는 이벤트.
       * @event Grid#contentError
       * @param {Grid.OnContentError} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
       * @example
       * ```js
       * grid.on("contentError", e => {
       *   e.update();
       * });
       * ```
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
  protected fitOutlines(useFit = this.useFit) {
    const outlines = this.outlines;
    const startOutline = outlines.start;
    const endOutline = outlines.end;
    const outlineOffset = startOutline.length ? Math.min(...startOutline) : 0;

    // If the outline is less than 0, a fit occurs forcibly.
    if (!useFit && outlineOffset > 0) {
      return;
    }

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
  protected readyItems(mounted: GridItem[], updated: GridItem[], options: RenderOptions) {
    const prevOutlines = this.outlines;
    const direction = options.direction || this.options.defaultDirection!;
    const prevOutline = options.outline || prevOutlines[direction === "end" ? "start" : "end"];
    const items = this.items;
    let nextOutlines = {
      start: [...prevOutline],
      end: [...prevOutline],
    };

    mounted.forEach((item) => {
      item.mountState = MOUNT_STATE.MOUNTED;
    });
    updated.forEach((item) => {
      item.isUpdating = true;
    });
    if (items.length) {
      nextOutlines = this.applyGrid(this.items, direction, prevOutline);
    }
    updated.forEach((item) => {
      item.isUpdating = false;
    });
    this.setOutlines(nextOutlines);
    this.fitOutlines();
    this.itemRenderer.renderItems(this.items);
    this._refreshContainerContentSize();

    const transitionMounted = mounted.filter((item) => item.hasTransition);

    if (transitionMounted.length) {
      this.containerManager.resize();
      transitionMounted.forEach((item) => {
        const element = item.element!;

        element.style.transitionDuration = item.transitionDuration;
      });
    }
    this._renderComplete({
      direction,
      mounted,
      updated,
      isResize: !!options.useResize,
    });
    const shouldReupdateItems = updated.filter((item) => item.shouldReupdate);

    if (shouldReupdateItems.length) {
      this.updateItems(shouldReupdateItems);
    }
  }
  protected _isObserverEnabled() {
    return this.containerManager.isObserverEnabled();
  }
  protected _updateItems(items: GridItem[]) {
    this.itemRenderer.updateEqualSizeItems(items, this.getItems());
  }
  private _renderComplete(e: OnRenderComplete) {
    /**
     * This event is fired when the Grid has completed rendering.
     * @ko Grid가 렌더링이 완료됐을 때  발생하는 이벤트이다.
     * @event Grid#renderComplete
     * @param {Grid.OnRenderComplete} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
     * @example
     * ```js
     * grid.on("renderComplete", e => {
     *   console.log(e.mounted, e.updated, e.useResize);
     * });
     * ```
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
  private _onResize = (e: ResizeWatcherResizeEvent) => {
    if (e.isResizeContainer) {
      this._renderItems({
        useResize: true,
      }, true);
    } else {
      const updatedItems = getUpdatedItems(this.items, e.childEntries);

      if (updatedItems.length > 0) {
        this.updateItems(updatedItems);
      }
    }
  }
  private _init() {
    this._resizeContainer();
  }
  private _renderItems(options: RenderOptions = {}, isTrusted?: boolean) {
    this._clearRenderTimer();

    const isResize = options.useResize || options.useOrgResize;


    if (isResize && !isTrusted) {
      // Resize container
      // isTrusted has already been resized internally.
      this._resizeContainer();
      this.itemRenderer.resize();
    }

    if (!this.getItems().length && this.getChildren().length) {
      this.syncElements(options);
    } else if (isResize) {
      // Update all items
      this.updateItems(this.items, options);
    } else {
      // Update only items that need to be updated.
      this.checkReady(options);
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
 * @default 0
 * @example
 * ```js
 * import { MasonryGrid } from "@egjs/grid";
 *
 * const grid = new MasonryGrid(container, {
 *   gap: 0,
 * });
 *
 * grid.gap = 5;
 * ```
 */

/**
 * The default direction value when direction is not set in the render option.
 * @ko render옵션에서 direction을 미설정시의 기본 방향값.
 * @name Grid#defaultDirection
 * @type {$ts:Grid.GridOptions["defaultDirection"]}
 * @default "end"
 * @example
 * ```js
 * import { MasonryGrid } from "@egjs/grid";
 *
 * const grid = new MasonryGrid(container, {
 *   defaultDirection: "end",
 * });
 *
 * grid.defaultDirection = "start";
 * ```
 */


/**
 * Whether to move the outline to 0 when the top is empty when rendering. However, if it overflows above the top, the outline is forced to 0. (default: true)
 * @ko 렌더링시 상단이 비어있을 때 아웃라인을 0으로 이동시킬지 여부. 하지만 상단보다 넘치는 경우 아웃라인을 0으로 강제 이동한다. (default: true)
 * @name Grid#useFit
 * @type {$ts:Grid.GridOptions["useFit"]}
 * @default true
 * @example
 * ```js
 * import { MasonryGrid } from "@egjs/grid";
 *
 * const grid = new MasonryGrid(container, {
 *   useFit: true,
 * });
 *
 * grid.useFit = false;
 * ```
 */

/**
 * Whether to preserve the UI of the existing container or item when destroying.
 * @ko destroy 시 기존 컨테이너, 아이템의 UI를 보존할지 여부.
 * @name Grid#preserveUIOnDestroy
 * @type {$ts:Grid.GridOptions["preserveUIOnDestroy"]}
 * @default false
 * @example
 * ```js
 * import { MasonryGrid } from "@egjs/grid";
 *
 * const grid = new MasonryGrid(container, {
 *   preserveUIOnDestroy: false,
 * });
 *
 * grid.preserveUIOnDestroy = true;
 * ```
 */


/**
 * The number of outlines. If the number of outlines is 0, it is calculated according to the type of grid.
 * @ko outline의 개수. 아웃라인의 개수가 0이라면 grid의 종류에 따라 계산이 된다.
 * @name Grid#outlineLength
 * @type {$ts:Grid.GridOptions["outlineLength"]}
 * @default 0
 * @example
 * ```js
 * import { MasonryGrid } from "@egjs/grid";
 *
 * const grid = new MasonryGrid(container, {
 *   outlineLength: 0,
 *   outlineSize: 0,
 * });
 *
 * grid.outlineLength = 3;
 * ```
 */


/**
 * The size of the outline. If the outline size is 0, it is calculated according to the grid type.
 * @ko outline의 사이즈. 만약 outline의 사이즈가 0이면, grid의 종류에 따라 계산이 된다.
 * @name Grid#outlineSize
 * @type {$ts:Grid.GridOptions["outlineSize"]}
 * @default 0
 * @example
 * ```js
 * import { MasonryGrid } from "@egjs/grid";
 *
 * const grid = new MasonryGrid(container, {
 *   outlineLength: 0,
 *   outlineSize: 0,
 * });
 *
 * grid.outlineSize = 300;
 * ```
 */

