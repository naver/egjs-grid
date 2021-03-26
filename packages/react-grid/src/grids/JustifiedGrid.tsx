import {
  JustifiedGrid as VanillaJustifiedGrid,
  JustifiedGridOptions,
} from "@egjs/grid";
import { Grid } from "../Grid";

export class JustifiedGrid extends Grid<JustifiedGridOptions> {
  public static GridClass = VanillaJustifiedGrid;
}
