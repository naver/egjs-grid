/* eslint-disable import/no-webpack-loader-syntax */
import MasonryGridApp from "./apps/ReactMasonryGrid100App";
import RawMaonsryGridApp from "!!raw-loader!./apps/ReactMasonryGrid100App";
import "../../../../stories/templates/default.css";
import { MASONRY_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertReactTemplate, makeArgs } from "../../../../stories/utils";

export const MasonryGrid100Template = MasonryGridApp as any;


MasonryGrid100Template.storyName = "MasonryGrid with item that place 100% columns";
MasonryGrid100Template.argTypes = MASONRY_GRID_CONTROLS;
MasonryGrid100Template.args = {
  ...makeArgs(MasonryGrid100Template.argTypes),
};

MasonryGrid100Template.parameters = {
  preview: [
    {
      tab: "React",
      template: convertReactTemplate(convertPath(RawMaonsryGridApp, "react-grid", "@egjs/react-grid")),
      language: "tsx",
    },
  ],
};
