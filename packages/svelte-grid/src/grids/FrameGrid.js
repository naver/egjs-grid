import Grid from "../Grid.svelte";
import { FrameGrid as GridClass } from "@egjs/grid";

let SvelteFrameGrid;

if (typeof Grid === "object") {
  SvelteFrameGrid = Grid;
} else {
  SvelteFrameGrid = class SvelteFrameGrid extends Grid {
    constructor(options) {
      options.props.GridClass = GridClass;
      super(options);
    }
  }
}
export { SvelteFrameGrid as FrameGrid };
