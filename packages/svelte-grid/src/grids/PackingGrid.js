import Grid from "../Grid.svelte";
import { PackingGrid as GridClass } from "@egjs/grid";

let SveltePackingGrid;

if (typeof Grid === "object") {
  SveltePackingGrid = Grid;
} else {
  SveltePackingGrid = class SveltePackingGrid extends Grid {
    constructor(options) {
      options.props.GridClass = GridClass;
      super(options);
    }
  }
}
export { SveltePackingGrid as PackingGrid };
