import Grid from "../Grid.svelte";
import { PackingGrid as GridClass } from "@egjs/grid";

let PackingGrid;

if (typeof Grid === "object") {
  PackingGrid = Grid;
} else {
  PackingGrid = class PackingGrid extends Grid {
    constructor(options) {
      options.props.GridClass = GridClass;
      super(options);
    }
  }
}
export { PackingGrid };
