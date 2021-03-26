import Grid from "../Grid.svelte";
import { MasonryGrid as GridClass } from "@egjs/grid";

export class MasonryGrid extends Grid {
  constructor(options) {
    options.props.GridClass = GridClass;
    super(options);
  }
}
