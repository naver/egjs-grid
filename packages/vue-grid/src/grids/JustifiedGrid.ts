import {
  JustifiedGrid as VanillaJustifiedGrid,
} from "@egjs/grid";
import Grid from "../Grid";
import { makeGrid } from "../utils";
import { VueGridInterface } from "../types";

export const JustifiedGrid = makeGrid("justified-grid", VanillaJustifiedGrid, Grid);
export type JustifiedGrid = VueGridInterface<typeof VanillaJustifiedGrid>;
