/* eslint-disable import/no-webpack-loader-syntax */
import * as React from "react";
import { makeArgs } from "../utils";
import JustifiedGridApp from "./apps/VanillaJustifiedGridApp";
import { CROPPED_JUSTIFIED_GRID_CONTROLS } from "../templates/controls";
import { JustifiedGrid } from "../../src";
import { getApp, renderContainer } from "../templates/ReactJSX";
import "../templates/default.css";
import { getPreview } from "../templates/preview";

export const CroppedJustifiedGridTemplate = getApp(JustifiedGrid, JustifiedGridApp, renderContainer);


CroppedJustifiedGridTemplate.storyName = "Cropped JustifiedGrid";
CroppedJustifiedGridTemplate.argTypes = CROPPED_JUSTIFIED_GRID_CONTROLS;
CroppedJustifiedGridTemplate.args = { ...makeArgs(CroppedJustifiedGridTemplate.argTypes) };

CroppedJustifiedGridTemplate.parameters = {
  preview: getPreview("2-JustifiedGrid", "JustifiedGrid"),
};
