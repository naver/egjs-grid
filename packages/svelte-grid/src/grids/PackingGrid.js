import Grid from "../Grid.svelte";
import { PackingGrid as GridClass } from "@egjs/grid";

export class PackingGrid extends Grid {
  constructor(options) {
    options.props.GridClass = GridClass;
    super(options);
  }
}
