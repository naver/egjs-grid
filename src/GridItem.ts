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
 * @property - Attributes set as `data-grid-` of element. <ko>element의 `data-grid-`으로 설정된 속성들.</ko>
 * @property - cssText of the first style when an element is added to the container. <ko>element가 container에 추가됐을 때 처음 style의 cssText.</ko>
 * @property - The element's rect before first rendering. <ko>처음 렌더링 하기 전 엘리먼트의 rect.</ko>
 * @property - The updated element's rect before rendering. <ko>렌더링 하기 전 업데이트 된 엘리먼트의 rect.</ko>
 * @property - The CSS rect of the item to be rendered by being applied to the Grid. <ko>Grid에 적용되어 렌더링을 하기 위한 item의 CSS rect</ko>
 * @property - Additional data of the item. <ko>item의 추가적인 데이터들.</ko>
 */
export interface GridItemStatus {
  key?: string;
  element?: HTMLElement | null;
  mountState?: MOUNT_STATE;
  updateState?: UPDATE_STATE;
  attributes?: Record<string, string>;
  orgCSSText?: string;
  orgRect?: Required<DOMRect>;
  rect?: Required<DOMRect>;
  cssRect?: DOMRect;
  data?: Record<string, string>;
}


/**
 * @memberof Grid
 * @implements Grid.GridItem.GridItemStatus
 */
class GridItem {
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
      mountState: MOUNT_STATE.UNCHECKED,
      updateState: UPDATE_STATE.NEED_UPDATE,
      element: element || null,
      orgCSSText: element?.style.cssText ?? "",
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
    const orgRect = (this.orgRect || this.rect);

    return this.horizontal ? orgRect.height : orgRect.width;
  }
  /**
   * The size in content direction before first rendering. "height" if horizontal is false, "width" otherwise.
   * @ko 첫 렌더링 되기 전의 content 방향의 사이즈. horizontal이 false면 "height", 아니면 "width".
   * @member Grid.GridItem#orgContentSize
   */
  public get orgContentSize() {
    const orgRect = (this.orgRect || this.rect);

    return this.horizontal ? orgRect.width : orgRect.height;
  }
  /**
   * The size in inline direction. "width" if horizontal is false, "height" otherwise.
   * @ko inline 방향의 사이즈. horizontal이 false면 "width", 아니면 "height".
   * @member Grid.GridItem#inlineSize
   */
  public get inlineSize() {
    const rect = this.rect;

    return this.horizontal ? rect.height : rect.width;
  }
  /**
   * The size in content direction. "height" if horizontal is false, "width" otherwise.
   * @ko content 방향의 사이즈. horizontal이 false면 "height", 아니면 "width".
   * @member Grid.GridItem#contentSize
   */
  public get contentSize() {
    const rect = this.rect;

    return this.horizontal ? rect.width : rect.height;
  }
  /**
   * The CSS size in inline direction applied to the Grid. "width" if horizontal is false, "height" otherwise.
   * @ko Grid에 적용된 inline 방향의 CSS 사이즈. horizontal이 false면 "width", 아니면 "height".
   * @member Grid.GridItem#cssInlineSize
   */
  public get cssInlineSize() {
    const cssRect = this.cssRect;

    return this.horizontal ? cssRect.height! : cssRect.width!;
  }
  /**
   * The CSS size in content direction applied to the Grid. "height" if horizontal is false, "width" otherwise.
   * @ko Grid에 적용된 content 방향의 CSS 사이즈. horizontal이 false면 "height", 아니면 "width".
   * @member Grid.GridItem#cssContentSize
   */
  public get cssContentSize() {
    const cssRect = this.cssRect;

    return this.horizontal ? cssRect.width! : cssRect.height!;
  }
  /**
   * The CSS pos in inline direction applied to the Grid. "left" if horizontal is false, "top" otherwise.
   * @ko Grid에 적용된 inline 방향의 CSS 포지션. horizontal이 false면 "left", 아니면 "top".
   * @member Grid.GridItem#cssInlinePos
   */
  public get cssInlinePos() {
    const cssRect = this.cssRect;

    return this.horizontal ? cssRect.top! : cssRect.left!;
  }
  /**
   * The CSS pos in content direction applied to the Grid. "top" if horizontal is false, "left" otherwise.
   * @ko Grid에 적용된 content 방향의 CSS 포지션. horizontal이 false면 "top", 아니면 "left".
   * @member Grid.GridItem#cssContentPos
   */
  public get cssContentPos() {
    const cssRect = this.cssRect;

    return this.horizontal ? cssRect.left! : cssRect.top!;
  }
  public set cssInlinePos(inlinePos: number) {
    const cssRect = this.cssRect;

    cssRect[this.horizontal ? "top" : "left"] = inlinePos;
  }
  public set cssContentPos(contentPos: number) {
    const cssRect = this.cssRect;

    cssRect[this.horizontal ? "left" : "top"] = contentPos;
  }
  public set cssInlineSize(inlineSize: number) {
    const cssRect = this.cssRect;

    cssRect[this.horizontal ? "height" : "width"] = inlineSize;
  }
  public set cssContentSize(contentSize: number) {
    const cssRect = this.cssRect;

    cssRect[this.horizontal ? "width" : "height"] = contentSize;
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
  public getStatus(): GridItemStatus {
    return {
      mountState: this.mountState,
      updateState: this.updateState,
      attributes: this.attributes,
      orgCSSText: this.orgCSSText,
      element: null,
      key: this.key,
      orgRect: this.orgRect,
      rect: this.rect,
      cssRect: this.cssRect,
      data: this.data,
    };
  }
}

interface GridItem extends Required<GridItemStatus> {
}
export { GridItem };
