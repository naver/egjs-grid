import {
  PackingGrid as VanillaPackingGrid,
  PackingGridOptions,
} from "@egjs/grid";
import { Grid } from "../Grid";

export class PackingGrid extends Grid<PackingGridOptions> {
  public static GridClass = VanillaPackingGrid;
}
