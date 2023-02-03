import Grid from "../Grid.svelte";
import { JustifiedGrid as GridClass } from "@egjs/grid";

let SvelteJustifiedGrid;

if (typeof Grid === "object") {
  SvelteJustifiedGrid = Grid;
} else {
  SvelteJustifiedGrid = class SvelteJustifiedGrid extends Grid {
    constructor(options) {
      options.props.GridClass = GridClass;
      super(options);
    }
  }
}
export { SvelteJustifiedGrid as JustifiedGrid };
