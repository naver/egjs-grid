import {
  MasonryGrid as VanillaMasonryGrid,
  MasonryGridOptions,
} from "@egjs/grid";
import { Grid } from "../Grid";

export class MasonryGrid extends Grid<MasonryGridOptions> {
  public static GridClass = VanillaMasonryGrid;
}
