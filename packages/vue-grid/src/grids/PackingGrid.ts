import {
  PackingGrid as VanillaPackingGrid,
} from "@egjs/grid";
import Grid from "../Grid.vue";
import { makeGrid } from "../utils";
import { VueGridInterface } from "../types";

export const PackingGrid = makeGrid("packing-grid", VanillaPackingGrid, Grid);
export type PackingGrid = VueGridInterface<typeof VanillaPackingGrid>;
