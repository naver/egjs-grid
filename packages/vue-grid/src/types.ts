/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import Grid, { GridFunction, GridMethods } from "@egjs/grid";

export type VueGridProps<T extends GridFunction> = T["defaultOptions"] & {
  tag?: string;
};
export interface VueGridInterface<T extends GridFunction> extends GridMethods<VueGridInterface<T>> {
  $el: HTMLElement;
  $_grid: Grid;
  $props: VueGridProps<T>;
}
