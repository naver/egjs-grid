/* eslint-disable import/no-webpack-loader-syntax */
import * as React from "react";
import { makeArgs } from "../utils";
import JustifiedGridApp from "./apps/VanillaJustifiedGridApp";
import { JUSTIFIED_GRID_CONTROLS } from "../templates/controls";
import { JustifiedGrid } from "../../src";
import { getApp, renderContainer } from "../templates/ReactJSX";
import "../templates/default.css";
import { getPreview } from "../templates/preview";

export const JustifiedGridTemplate = getApp(JustifiedGrid, JustifiedGridApp, renderContainer);


JustifiedGridTemplate.storyName = "JustifiedGrid";
JustifiedGridTemplate.argTypes = JUSTIFIED_GRID_CONTROLS;
JustifiedGridTemplate.args = { ...makeArgs(JustifiedGridTemplate.argTypes) };

JustifiedGridTemplate.parameters = {
  preview: getPreview("2-JustifiedGrid", "JustifiedGrid"),
};
