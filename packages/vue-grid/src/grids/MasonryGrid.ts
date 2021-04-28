import {
  MasonryGrid as VanillaMasonryGrid,
} from "@egjs/grid";
import Grid from "../Grid";
import { makeGrid } from "../utils";
import { VueGridInterface } from "../types";

export const MasonryGrid = makeGrid("masonry-grid", VanillaMasonryGrid, Grid);
export type MasonryGrid = VueGridInterface<typeof VanillaMasonryGrid>;
