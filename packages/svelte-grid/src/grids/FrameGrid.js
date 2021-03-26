import Grid from "../Grid.svelte";
import { FrameGrid as GridClass } from "@egjs/grid";

export class FrameGrid extends Grid {
  constructor(options) {
    options.props.GridClass = GridClass;
    super(options);
  }
}
