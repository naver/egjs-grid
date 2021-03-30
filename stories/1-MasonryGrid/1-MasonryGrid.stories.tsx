import { makeArgs } from "../utils";
import MasonryGridApp from "./apps/VanillaMasonryGridApp";
import { MASONRY_GRID_CONTROLS } from "../templates/controls";
import { MasonryGrid } from "../../src";
import { getApp, renderContainer } from "../templates/ReactJSX";
import { getPreview } from "../templates/preview";
import "../templates/default.css";

export const MasonryGridTemplate = getApp(MasonryGrid, MasonryGridApp, renderContainer);

MasonryGridTemplate.storyName = "MasonryGrid";
MasonryGridTemplate.argTypes = MASONRY_GRID_CONTROLS;
MasonryGridTemplate.args = { ...makeArgs(MasonryGridTemplate.argTypes) };

MasonryGridTemplate.parameters = {
  preview: getPreview("1-MasonryGrid", "MasonryGrid"),
};


