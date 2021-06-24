/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import {
  GridFunction, GridOptions, GRID_EVENTS, GRID_METHODS,
} from "@egjs/grid";
import { FrameGrid } from "./grids/FrameGrid";
import { JustifiedGrid } from "./grids/JustifiedGrid";
import { MasonryGrid } from "./grids/MasonryGrid";
import { PackingGrid } from "./grids/PackingGrid";
import { VueGridInterface } from "./types";

export function makeGrid<T extends GridFunction>(tagName: string, GridClass: T, VueComponent: any) {
  const {
    propertyTypes,
    defaultOptions,
  } = GridClass;
  const watch: Record<string, any> = {};

  for (const name in propertyTypes) {
    watch[name] = function (this: any, value: any) {
      this.$_grid[name] = value;
    };
  }
  const methods: Record<string, any> = {};

  GRID_METHODS.forEach(name => {
    methods[name] = function (this: any, ...args: any[]) {
      return this.$_grid[name](...args);
    };
  });

  return {
    ...VueComponent,
    name: tagName,
    props: ["tag", ...Object.keys(defaultOptions)],
    watch,
    methods,
    mounted(this: any) {
      const options: Partial<GridOptions> = {};
      const props = this.$props;

      for (const name in defaultOptions) {
        if (name in props && typeof props[name] !== "undefined") {
          (options as any)[name] = (props as any)[name];
        }
      }
      this.$_grid = new GridClass(this.$refs.container, options);
      this.$_grid.renderItems();

      GRID_EVENTS.forEach(name => {
        this.$_grid.on(name, (e: any) => {
          this.$emit(name, { ...e });
        });
      });
    },
    beforeDestroy(this: any) {
      this.$_grid.destroy();
    },
    beforeUnmount(this: any) {
      this.$_grid.destroy();
    },
  } as VueGridInterface<T>;
}

export function install(app: { component: (name: string, module: any) => any }): void {
  app.component("masonry-grid", MasonryGrid);
  app.component("justified-grid", JustifiedGrid);
  app.component("frame-grid", FrameGrid);
  app.component("packing-grid", PackingGrid);
};
