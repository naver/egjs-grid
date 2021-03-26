import Grid from "../Grid.svelte";
import { JustifiedGrid as GridClass } from "@egjs/grid";

export class JustifiedGrid extends Grid {
  constructor(options) {
    options.props.GridClass = GridClass;
    super(options);
  }
}
