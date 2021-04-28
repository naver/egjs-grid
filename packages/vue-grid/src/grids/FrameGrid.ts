import {
  FrameGrid as VanillaFrameGrid,
} from "@egjs/grid";
import Grid from "../Grid";
import { makeGrid } from "../utils";
import { VueGridInterface } from "../types";

export const FrameGrid = makeGrid("frame-grid", VanillaFrameGrid, Grid);
export type FrameGrid = VueGridInterface<typeof VanillaFrameGrid>;
