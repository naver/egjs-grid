/* eslint-disable import/no-webpack-loader-syntax */
import * as React from "react";
import { makeArgs } from "../utils";
import FrameGridApp from "./apps/VanillaFrameGridApp";
import { FRAME_GRID_CONTROLS } from "../templates/controls";
import { FrameGrid } from "../../src";
import { getApp, renderContainer } from "../templates/ReactJSX";
import "../templates/default.css";
import { getPreview } from "../templates/preview";

export const FrameGridTemplate =  getApp(FrameGrid, FrameGridApp, renderContainer);


FrameGridTemplate.storyName = "FrameGrid";
FrameGridTemplate.argTypes = FRAME_GRID_CONTROLS;
FrameGridTemplate.args = { ...makeArgs(FrameGridTemplate.argTypes) };

FrameGridTemplate.parameters = {
  preview: getPreview("3-FrameGrid", "FrameGrid"),
};
