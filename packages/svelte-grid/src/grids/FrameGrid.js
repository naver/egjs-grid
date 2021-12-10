import Grid from "../Grid.svelte";
import { FrameGrid as GridClass } from "@egjs/grid";

let FrameGrid;

if (typeof Grid === "object") {
  FrameGrid = Grid;
} else {
  FrameGrid = class FrameGrid extends Grid {
    constructor(options) {
      options.props.GridClass = GridClass;
      super(options);
    }
  }
}
export { FrameGrid };
