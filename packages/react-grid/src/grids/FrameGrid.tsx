import {
  FrameGrid as VanillaFrameGrid,
  FrameGridOptions,
} from "@egjs/grid";
import { Grid } from "../Grid";

export class FrameGrid extends Grid<FrameGridOptions> {
  public static GridClass = VanillaFrameGrid;
}
