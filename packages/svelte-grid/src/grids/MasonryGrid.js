import Grid from "../Grid.svelte";
import { MasonryGrid as GridClass } from "@egjs/grid";

let SvelteMasonryGrid;

if (typeof Grid === "object") {
  SvelteMasonryGrid = Grid;
} else {
  SvelteMasonryGrid = class SvelteMasonryGrid extends Grid {
    constructor(options) {
      options.props.GridClass = GridClass;
      super(options);
    }
  }
}
export { SvelteMasonryGrid as MasonryGrid };
