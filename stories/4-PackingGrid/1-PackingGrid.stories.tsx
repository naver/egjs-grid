/* eslint-disable import/no-webpack-loader-syntax */
import * as React from "react";
import { makeArgs } from "../utils";
import PackingGridApp from "./apps/VanillaPackingGridApp";
import { PACKING_GRID_CONTROLS } from "../templates/controls";
import { PackingGrid } from "../../src";
import { getApp, renderContainer } from "../templates/ReactJSX";
import "../templates/default.css";
import { getPreview } from "../templates/preview";

export const PackingGridTemplate = getApp(PackingGrid, PackingGridApp, renderContainer);


PackingGridTemplate.storyName = "PackingGrid";
PackingGridTemplate.argTypes = PACKING_GRID_CONTROLS;
PackingGridTemplate.args = { ...makeArgs(PackingGridTemplate.argTypes) };

PackingGridTemplate.parameters = {
  preview: getPreview("4-PackingGrid", "PackingGrid"),
};
