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
 */
export interface GridOptions {
  /**
   * Direction of the scroll movement. (true: horizontal, false: vertical) If horizontal is false, `inlinePos` is left, `inlineSize` is width, `contentPos` is top, and `contentSize` is height. If horizontal is true, `inlinePos` is top, `inlineSize` is height, `contentPos` is left, and `contentSize` is width.
   * <ko>스크롤 이동 방향. (true: 가로방향, false: 세로방향) horizontal이 false 면 `inlinePos`는 left, `inlineSize`는 width, `contentPos`는 top, `contentSize`는 height다. horizontal이 true면 `inlinePos`는 top, `inlineSize`는 height, `contentPos`는 left, `contentSize`는 width이다.</ko>
   * @default false
   */
  horizontal?: boolean;
  /**
   * Whether to set the css size and position of the item to %.
   * <ko>item의 css size와 position를 %로 설정할지 여부.</ko>
   * @default false
   */
  percentage?: Array<"position" | "size"> | boolean;
  /**
   * Indicates whether sizes of all card elements are equal to one another. If sizes of card elements to be arranged are all equal and this option is set to "true", the performance of layout arrangement can be improved.
   * <ko>카드 엘리먼트의 크기가 동일한지 여부. 배치될 카드 엘리먼트의 크기가 모두 동일할 때 이 옵션을 'true'로 설정하면 레이아웃 배치 성능을 높일 수 있다.</ko>
   * @default false
   */
  isEqualSize?: boolean;
  /**
   * Indicates whether sizes of all card elements does not change, the performance of layout arrangement can be improved.
   * <ko>모든 카드 엘리먼트의 크기가 불변일 때 이 옵션을 'true'로 설정하면 레이아웃 배치 성능을 높일 수 있다.</ko>
   * @default false
   */
  isConstantSize?: boolean;
  /**
   * Gap used to create space around items.
   * <ko>아이템들 사이의 공간.</ko>
   * @default 5
   */
  gap?: number;
  /**
   * The prefix to use element's data attribute.
   * <ko>엘리먼트의 데이타 속성에 사용할 접두사.</ko>
   * @default "data-grid-"
   */
  attributePrefix?: string;
  /**
   * Debounce time to set in the resize event. (unit: ms)
   * <ko>리사이즈 이벤트에 설정할 디바운스 시간.(단위: ms)</ko>
   * @default 100
   */
  resizeDebounce?: number;
  /**
   * Maximum time to debounce the resize event. (0 is not set)
   * <ko>리사이즈 이벤트를 디바운스할 수 있는 최대 시간. (0은 미설정이다)</ko>
   * @default 0
   */
  maxResizeDebounce?: number;
  /**
   * Whether the resize method should be called automatically after a window resize event.
   * <ko>window의 resize 이벤트 이후 자동으로 resize()메소드를 호출할지의 여부.</ko>
   * @default true
   */
  autoResize?: boolean;
  /**
   * Whether to move the outline to 0 when the top is empty when rendering. However, if it overflows above the top, the outline is forced to 0.
   * <ko>렌더링시 상단이 비어있을 때 아웃라인을 0으로 이동시킬지 여부. 하지만 상단보다 넘치는 경우 아웃라인을 0으로 강제 이동한다.</ko>
   * @default true
   */
  useFit?: boolean;
  /**
   * Whether to use transform property instead of using left and top css properties.
   * <ko>left, top css 속성 쓰는 대신 transform 속성을 사용할지 여부.</ko>
   * @default false
   */
  useTransform?: boolean;
  /**
   * Whether to automatically render through property change.
   * <ko>property의 변화를 통해 자동으로 render를 할지 여부.</ko>
   * @default true
   */
  renderOnPropertyChange?: boolean;
  /**
   * Whether to preserve the UI of the existing container or item when destroying.
   * <ko>destroy 시 기존 컨테이너, 아이템의 UI를 보존할지 여부.</ko>
   * @default false
   */
  preserveUIOnDestroy?: boolean;
  /**
   * The default direction value when direction is not set in the render option.
   * <ko>render옵션에서 direction을 미설정시의 기본 방향값.</ko>
   * @default "end"
   */
  defaultDirection?: "start" | "end";
  /**
   * The number of outlines. If the number of outlines is 0, it is calculated according to the type of grid.
   * <ko>outline의 개수. 아웃라인의 개수가 0이라면 grid의 종류에 따라 계산이 된다.</ko>
   * @default 0
   */
  outlineLength?: number;
  /**
   * The size of the outline. If the outline size is 0, it is calculated according to the grid type.
   * <ko> outline의 사이즈. 만약 outline의 사이즈가 0이면, grid의 종류에 따라 계산이 된다. </ko>
   * @default 0
   */
  outlineSize?: number;
  /**
   * Whether to get the size as rounded size(offsetWidth, offsetHeight). Set to true if transform is applied to the container. If false, get the size through getBoundingClientRect.
   * <ko>사이즈를 반올림된 사이즈(offsetWidth, offsetHeight)로 가져올지 여부. container에 transform이 적용되어 있다면 true로 설정해라. false면 getBoundingClientRect를 통해 사이즈를 가져온다.</ko>
   * @default true
   */
  useRoundedSize?: boolean;
  /**
   * Whether to use ResizeObserver event to detect container size change when `autoResize` option is used.
   * <ko>autoResize 옵션 사용시 container의 사이즈 변화 감지를 위해 ResizeObserver 이벤트를 사용할지 여부.</ko>
   * @default false
   */
  useResizeObserver?: boolean;
  /**
   * Whether to detect size change of children if useResizeObserver option is used.
   * <ko>useResizeObserver옵션을 사용한다면 children의 사이즈 변화 감지 여부.</ko>
   * @default false
   */
  observeChildren?: boolean;
  /**
   * You can set the ItemRenderer directly externally.
   * <ko>외부에서 직접 ItemRenderer를 설정할 수 있다.</ko>
   * @inner
   */
  externalItemRenderer?: ItemRenderer | null;
  /**
   * You can set the ContainerManager directly externally.
   * <ko>외부에서 직접 ContainerManager를 설정할 수 있다.</ko>
   * @inner
   */
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
 * @property - Whether to resize items to their original size. <ko>아이템들의 원본 사이즈까지 리사이즈할지 여부.</ko>
 */
export interface RenderOptions {
  outline?: number[];
  direction?: "start" | "end";
  useResize?: boolean;
  useOrgResize?: boolean;
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
export interface SizeRect {
  width: number;
  height: number;
}

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
