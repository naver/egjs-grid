/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import { DOMRect, GridRect } from "./types";
import { MOUNT_STATE, RECT_NAMES, UPDATE_STATE } from "./consts";

/**
 * @typedef
 * @memberof Grid.GridItem
 * @property - The item key. <ko>아이템 키.</ko>
 * @property - The element for the item. <ko>아이템에 있는 엘리먼트.</ko>
 * @property - State of whether the element has been added to the container. <ko>element가 container에 추가되었는지 상태.</ko>
 * @property - The update state of the element's rect. <ko>element의 rect의 업데이트 상태.</ko>
 * @property - Whether the element's rect was updated for the first time. <ko>처음으로 element의 rect를 업데이트 했는지 여부.</ko>
 * @property - Attributes set as `data-grid-` of element. <ko>element의 `data-grid-`으로 설정된 속성들.</ko>
 * @property - cssText of the first style when an element is added to the container. <ko>element가 container에 추가됐을 때 처음 style의 cssText.</ko>
 * @property - The element's rect before first rendering. <ko>처음 렌더링 하기 전 엘리먼트의 rect.</ko>
 * @property - The updated element's rect before rendering. <ko>렌더링 하기 전 업데이트 된 엘리먼트의 rect.</ko>
 * @property - The CSS rect of the item to be rendered by being applied to the Grid. <ko>Grid에 적용되어 렌더링을 하기 위한 item의 CSS rect</ko>
 * @property - Additional data of the item. <ko>item의 추가적인 데이터들.</ko>
 * @property - Grid ready data for rendering. <ko>렌더링을 하기 위한 grid의 준비 데이터.</ko>
 */
export interface GridItemStatus {
  key?: string | number;
  element?: HTMLElement | null;
  mountState?: MOUNT_STATE;
  updateState?: UPDATE_STATE;
  isFirstUpdate?: boolean;
  attributes?: Record<string, any>;
  orgCSSText?: string;
  orgRect?: Required<DOMRect>;
  rect?: Required<DOMRect>;
  cssRect?: DOMRect;
  data?: Record<string, any>;
  gridData?: Record<string, any>;
}

/**
 * @memberof Grid
 * @implements Grid.GridItem.GridItemStatus
 */
class GridItem {
  /**
   * Whether or not it will be updated upon request.
   * @inner
   */
  public isUpdating = false;
  /**
   * Whether the item needs to be updated again
   * @inner
   */
  public shouldReupdate = false;
  public hasTransition = false;
  public transitionDuration = "";
  public isRestoreOrgCSSText = true;

  /**
   * @constructor
   * @param horizontal - Direction of the scroll movement. (true: horizontal, false: vertical) <ko>스크롤 이동 방향. (true: 가로방향, false: 세로방향)</ko>
   * @param itemStatus - Default status object of GridItem module. <ko>GridItem 모듈의 기본 status 객체.</ko>
   */
  constructor(
    protected horizontal: boolean,
    itemStatus: Partial<GridItemStatus> = {},
  ) {
    const element = itemStatus.element;
    const status: Required<GridItemStatus> = {
      key: "",
      orgRect: { left: 0, top: 0, width: 0, height: 0 },
      rect: { left: 0, top: 0, width: 0, height: 0 },
      cssRect: {},
      attributes: {},
      data: {},
      isFirstUpdate: false,
      mountState: MOUNT_STATE.UNCHECKED,
      updateState: UPDATE_STATE.NEED_UPDATE,
      element: element || null,
      orgCSSText: element?.style.cssText ?? "",
      gridData: {},
      ...itemStatus,
    };

    for (const name in status) {
      this[name] = status[name];
    }
  }
  /**
   * The size in inline direction before first rendering. "width" if horizontal is false, "height" otherwise.
   * @ko 첫 렌더링 되기 전의 inline 방향의 사이즈. horizontal이 false면 "width", 아니면 "height".
   * @member Grid.GridItem#orgInlineSize
   */
  public get orgInlineSize() {
    const name = this._names.inlineSize;

    return this.orgRect[name] || this.rect[name];
  }
  /**
   * The size in content direction before first rendering. "height" if horizontal is false, "width" otherwise.
   * @ko 첫 렌더링 되기 전의 content 방향의 사이즈. horizontal이 false면 "height", 아니면 "width".
   * @member Grid.GridItem#orgContentSize
   */
  public get orgContentSize() {
    const name = this._names.contentSize;

    return this.orgRect[name] || this.rect[name];
  }
  /**
   * The size in inline direction. "width" if horizontal is false, "height" otherwise.
   * @ko inline 방향의 사이즈. horizontal이 false면 "width", 아니면 "height".
   * @member Grid.GridItem#inlineSize
   */
  public get inlineSize() {
    return this.rect[this._names.inlineSize];
  }
  /**
   * The size in content direction. "height" if horizontal is false, "width" otherwise.
   * @ko content 방향의 사이즈. horizontal이 false면 "height", 아니면 "width".
   * @member Grid.GridItem#contentSize
   */
  public get contentSize() {
    return this.rect[this._names.contentSize];
  }
  /**
   * The CSS size in inline direction applied to the Grid. "width" if horizontal is false, "height" otherwise.
   * @ko Grid에 적용된 inline 방향의 CSS 사이즈. horizontal이 false면 "width", 아니면 "height".
   * @member Grid.GridItem#cssInlineSize
   */
  public get cssInlineSize() {
    return this.cssRect[this._names.inlineSize];
  }
  /**
   * The CSS size in content direction applied to the Grid. "height" if horizontal is false, "width" otherwise.
   * @ko Grid에 적용된 content 방향의 CSS 사이즈. horizontal이 false면 "height", 아니면 "width".
   * @member Grid.GridItem#cssContentSize
   */
  public get cssContentSize() {
    return this.cssRect[this._names.contentSize];
  }
  /**
   * The CSS pos in inline direction applied to the Grid. "left" if horizontal is false, "top" otherwise.
   * @ko Grid에 적용된 inline 방향의 CSS 포지션. horizontal이 false면 "left", 아니면 "top".
   * @member Grid.GridItem#cssInlinePos
   */
  public get cssInlinePos() {
    return this.cssRect[this._names.inlinePos];
  }
  /**
   * The CSS pos in content direction applied to the Grid. "top" if horizontal is false, "left" otherwise.
   * @ko Grid에 적용된 content 방향의 CSS 포지션. horizontal이 false면 "top", 아니면 "left".
   * @member Grid.GridItem#cssContentPos
   */
  public get cssContentPos() {
    return this.cssRect[this._names.contentPos];
  }
  public set cssInlinePos(inlinePos: number | undefined) {
    this.cssRect[this._names.inlinePos] = inlinePos;
  }
  public set cssContentPos(contentPos: number | undefined) {
    this.cssRect[this._names.contentPos] = contentPos;
  }
  public set cssInlineSize(inlineSize: number | undefined) {
    this.cssRect[this._names.inlineSize] = inlineSize;
  }
  public set cssContentSize(contentSize: number | undefined) {
    this.cssRect[this._names.contentSize] = contentSize;
  }
  /**
   * Calculated size in the direction of the inline applied to the grid. "width" if horizontal is false, "height" otherwise.
   * @ko Grid에 적용된 inline 방향의 계산된 사이즈. horizontal이 false면 "width", 아니면 "height".
   * @member Grid.GridItem#computedInlineSize
   */
  public get computedInlineSize() {
    const name = this._names.inlineSize;

    return this.cssRect[name] || this.rect[name] || this.orgRect[name];
  }
  /**
   * Calculated size in the direction of the content applied to the grid. "height" if horizontal is false, "width" otherwise.
   * @ko Grid에 적용된 content 방향의 계산된 사이즈. horizontal이 false면 "height", 아니면 "width".
   * @member Grid.GridItem#computedContentSize
   */
  public get computedContentSize() {
    const name = this._names.contentSize;

    return this.cssRect[name] || this.rect[name] || this.orgRect[name];
  }
  /**
   * Calculated position in the direction of the inline applied to the grid. "left" if horizontal is false, "top" otherwise.
   * @ko Grid에 적용된 content 방향의 계산된 포지션. horizontal이 false면 "left", 아니면 "top".
   * @member Grid.GridItem#computedInlinePos
   */
  public get computedInlinePos() {
    const name = this._names.inlinePos;

    return this.cssRect[name] ?? this.rect[name];
  }
  /**
   * Calculated position in the direction of the content applied to the grid. "top" if horizontal is false, "left" otherwise.
   * @ko Grid에 적용된 content 방향의 계산된 포지션. horizontal이 false면 "top", 아니면 "left".
   * @member Grid.GridItem#computedContentPos
   */
  public get computedContentPos() {
    const name = this._names.contentPos;

    return this.cssRect[name] ?? this.rect[name];
  }
  /**
   * Set CSS Rect through GridRect.
   * @ko GridRect을 통해 CSS Rect를 설정한다.
   * @param - The style for setting CSS rect. <ko>CSS rect를 설정하기 위한 스타일.</ko>
   */
  public setCSSGridRect(gridRect: GridRect) {
    const names = RECT_NAMES[this.horizontal ? "horizontal" : "vertical"];

    const rect: DOMRect = {};

    for (const name in gridRect) {
      rect[names[name]] = gridRect[name];
    }
    this.cssRect = rect;
  }
  /**
   * Returns the status of the item.
   * @ko 아이템의 상태를 반환한다.
   */
  public getStatus(): Required<GridItemStatus> {
    return {
      mountState: this.mountState,
      updateState: this.updateState,
      attributes: this.attributes,
      orgCSSText: this.orgCSSText,
      isFirstUpdate: this.isFirstUpdate,
      element: null,
      key: this.key,
      orgRect: this.orgRect,
      rect: this.rect,
      cssRect: this.cssRect,
      gridData: this.gridData,
      data: this.data,
    };
  }
  /**
   * Returns minimized status of the item.
   * @ko 아이템의 간소화된 상태를 반환한다.
   */
  public getMinimizedStatus(): Partial<GridItemStatus> {
    const status: Partial<GridItemStatus> = {
      orgRect: this.orgRect,
      rect: this.rect,
      cssRect: this.cssRect,
      attributes: this.attributes,
      gridData: this.gridData,
    };

    const {
      key,
      mountState,
      updateState,
      isFirstUpdate,
      orgCSSText,
    } = this;
    if (typeof key !== "undefined") {
      status.key = key;
    }
    if (mountState !== MOUNT_STATE.UNCHECKED) {
      status.mountState = mountState;
    }
    if (updateState !== UPDATE_STATE.NEED_UPDATE) {
      status.updateState = updateState;
    }
    if (isFirstUpdate) {
      status.isFirstUpdate = true;
    }
    if (orgCSSText) {
      status.orgCSSText = orgCSSText;
    }
    return status;
  }
  private get _names() {
    return this.horizontal ? RECT_NAMES.horizontal : RECT_NAMES.vertical;
  }
}

interface GridItem extends Required<GridItemStatus> {
}
export { GridItem };
