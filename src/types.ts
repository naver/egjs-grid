/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import { GRID_METHODS } from "./consts";
import { ContainerManager, ContainerManagerStatus } from "./ContainerManager";
import Grid from "./Grid";
import { GridItem, GridItemStatus } from "./GridItem";
import { ItemRenderer, ItemRendererStatus } from "./ItemRenderer";


/**
 * @typedef
 * @memberof Grid
 * @property - Direction of the scroll movement. (true: horizontal, false: vertical) If horizontal is false, `inlinePos` is left, `inlineSize` is width, `contentPos` is top, and `contentSize` is height. If horizontal is true, `inlinePos` is top, `inlineSize` is height, `contentPos` is left, and `contentSize` is width.  (default: false)
 * <ko>스크롤 이동 방향. (true: 가로방향, false: 세로방향) horizontal이 false 면 `inlinePos`는 left, `inlineSize`는 width, `contentPos`는 top, `contentSize`는 height다. horizontal이 true면 `inlinePos`는 top, `inlineSize`는 height, `contentPos`는 left, `contentSize`는 width이다. (default: false)</ko>
 * @property - Whether to set the css size and position of the item to %. (default: false)<ko>item의 css size와 position를 %로 설정할지 여부.</ko>
 * @property - Indicates whether sizes of all card elements are equal to one another. If sizes of card elements to be arranged are all equal and this option is set to "true", the performance of layout arrangement can be improved. (default: false)<ko>카드 엘리먼트의 크기가 동일한지 여부. 배치될 카드 엘리먼트의 크기가 모두 동일할 때 이 옵션을 'true'로 설정하면 레이아웃 배치 성능을 높일 수 있다. (default: false)</ko>
 * @property - Indicates whether sizes of all card elements does not change, the performance of layout arrangement can be improved. (default: false)<ko>모든 카드 엘리먼트의 크기가 불변일 때 이 옵션을 'true'로 설정하면 레이아웃 배치 성능을 높일 수 있다. (default: false)</ko>
 * @property - Gap used to create space around items. (default: 5)<ko>아이템들 사이의 공간. (default: 5)</ko>
 * @property - The prefix to use element's data attribute. (default: "data-grid-")<ko>엘리먼트의 데이타 속성에 사용할 접두사. (default: "data-grid-")</ko>
 * @property - Debounce time to set in the resize event. (default: 100)<ko>리사이즈 이벤트에 설정할 디바운스 시간. (default: 100)</ko>
 * @property - Maximum time to debounce the resize event(0 is not set). (default: 0)<ko>리사이즈 이벤트를 디바운스할 수 있는 최대 시간(0은 미설정이다). (default: 0)</ko>
 * @property - Whether to move the outline to 0 when the top is empty when rendering. However, if it overflows above the top, the outline is forced to 0. (default: true) <ko>렌더링시 상단이 비어있을 때 아웃라인을 0으로 이동시킬지 여부. 하지만 상단보다 넘치는 경우 아웃라인을 0으로 강제 이동한다. (default: true)</ko>
 * @property - Whether the resize method should be called automatically after a window resize event. (default: true)<ko>window의 resize 이벤트 이후 자동으로 resize()메소드를 호출할지의 여부. (default: true)</ko>
 * @property - Whether to use transform property instead of using left and top css properties. <ko>left, top css 속성 쓰는 대신 transform 속성을 사용할지 여부.</ko>
 * @property - Whether to automatically render through property change. <ko>property의 변화를 통해 자동으로 render를 할지 여부.</ko>
 * @property - Whether to preserve the UI of the existing container or item when destroying. <ko>destroy 시 기존 컨테이너, 아이템의 UI를 보존할지 여부.</ko>
 * @property - The default direction value when direction is not set in the render option. <ko>render옵션에서 direction을 미설정시의 기본 방향값.</ko>
 * @property - You can set the ItemRenderer directly externally. <ko>외부에서 직접 ItemRenderer를 설정할 수 있다.</ko>
 * @property - You can set the ContainerManager를 directly externally. <ko>외부에서 직접 ContainerManager를 설정할 수 있다.</ko>
 */
export interface GridOptions {
  horizontal?: boolean;
  percentage?: Array<"position" | "size"> | boolean;
  isEqualSize?: boolean;
  isConstantSize?: boolean;
  gap?: number;
  attributePrefix?: string;
  resizeDebounce?: number;
  maxResizeDebounce?: number;
  autoResize?: boolean;
  useFit?: boolean;
  useTransform?: boolean;
  renderOnPropertyChange?: boolean;
  preserveUIOnDestroy?: boolean;
  defaultDirection?: "start" | "end";
  externalItemRenderer?: ItemRenderer | null;
  externalContainerManager?: ContainerManager | null;
}
/**
 * @typedef
 * @memberof Grid
 */
export interface GridOutlines {
  start: number[];
  end: number[];
}
/**
 * @typedef
 * @memberof Grid
 * @property - Array of outline points to be reference points.<ko>기준점이 되는 아웃라인 점들의 배열</ko>
 * @property - The direction to render the grid.<ko>Grid를 렌더링할 방향.</ko>
 * @property - Whether to resize containers and items.<ko>컨테이너와 아이템들을 리사이즈할지 여부.</ko>
 */
export interface RenderOptions {
  outline?: number[];
  direction?: "start" | "end";
  useResize?: boolean;
}
/**
 * @typedef
 * @memberof Grid
 */
export interface GridStatus {
  items: GridItemStatus[];
  outlines: GridOutlines;
  containerManager: ContainerManagerStatus;
  itemRenderer: ItemRendererStatus;
}
/**
 * @typedef
 * @memberof Grid
 * @property - The direction the grid was rendered. <ko>Grid가 렌더링된 방향.</ko>
 * @property - The items rendered for the first time. <ko>처음 렌더링한 아이템들,</ko>
 * @property - The items updated in size. <ko>사이즈 업데이트한 아이템들.</ko>
 * @property - Whether rendering was done using the resize event or the useResize option. <ko>resize 이벤트 또는 useResize 옵션을 사용하여 렌더링를 했는지 여부.</ko>
 */
export interface OnRenderComplete {
  direction: "start" | "end";
  isResize: boolean;
  mounted: GridItem[];
  updated: GridItem[];
}

/**
 * @typedef
 * @memberof Grid
 * @property - The item's element.<ko>아이템의 엘리먼트.</ko>
 * @property - The content element with error.<ko>에러난 발생한 콘텐츠 엘리먼트.</ko>
 * @property - The item with error content.<ko>에러난 콘텐츠를 가지고 있는 아이템</ko>
 * @property - If you have fixed the error and want to recheck it, call update(). If you remove an element, call the syncElements() method.<ko>에러를 해결했고 재검사하고 싶으면 update()를 호출해라. 만약 엘리먼트를 삭제한 경우 syncElements() 메서드를 호출해라.</ko>
 */
export interface OnContentError {
  element: HTMLElement;
  target: HTMLElement;
  item: GridItem;
  update(): void;
}
/**
 * @typedef
 * @memberof Grid
 */
export type GridAlign = "start" | "center" | "end" | "justify" | "stretch";

export type GridEvents = {
  renderComplete: OnRenderComplete;
  contentError: OnContentError;
};

/**
 * @typedef
 * @memberof Grid
 */
export interface DOMRect {
  width?: number;
  height?: number;
  top?: number;
  left?: number;
}

/**
 * @typedef
 * @memberof Grid
 * @property - The pos in inline direction. "left" if horizontal is false, "top" otherwise. <ko>inline 방향의 위치. horizontal이 false면 "left", 아니면 "top".</ko>
 * @property - The pos in content direction. "top" if horizontal is false, "left" otherwise. <ko>content 방향의 위치. horizontal이 false면 "top", 아니면 "left".</ko>
 * @property - The size in inline direction. "width" if horizontal is false, "height" otherwise. <ko>inline 방향의 사이즈. horizontal이 false면 "width", 아니면 "height".</ko>
 * @property - The size in content direction. "heighht" if horizontal is false, "width" otherwise. <ko>content 방향의 사이즈. horizontal이 false면 "height", 아니면 "width".</ko>
 */
export interface GridRect {
  inlinePos?: number;
  contentPos?: number;
  inlineSize?: number;
  contentSize?: number;
}

/**
 * @typedef
 * @memberof Grid
 * @property - Whether to preserve the current UI.<ko>현재의 UI를 보존할지 여부.</ko>
 */
export interface DestroyOptions {
  preserveUI?: boolean;
}

export type Properties<
  GridClass extends { propertyTypes: any, defaultOptions: any },
> = Pick<Required<GridClass["defaultOptions"]>, keyof GridClass["propertyTypes"]>;

export type Methods<
  Component,
  Class,
  MethodList extends Readonly<Array<keyof Class>>,
  MethodKeys extends keyof Class = MethodList[number]
> = {
  [key in MethodKeys]: Class[key] extends (...params: any[]) => Class
    ? (...params: Parameters<Class[key]>) => Component
    : Class[key];
}

export type GridMethods<Component> = Methods<Component, Grid, typeof GRID_METHODS>;
export type GridFunction
  = (new (container: HTMLElement, options: Partial<GridOptions>) => Grid)
  & { propertyTypes: any, defaultOptions: any };
