/* eslint-disable import/no-webpack-loader-syntax */
import MasonryGridApp from "./apps/ReactMasonryGridApp";
import RawMaonsryGridApp from "!!raw-loader!./apps/ReactMasonryGridApp";
import "../../../../stories/templates/default.css";
import { MASONRY_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertTemplate, makeArgs } from "../../../../stories/utils";

export const MasonryGridTemplate = MasonryGridApp as any;


MasonryGridTemplate.storyName = "MasonryGrid";
MasonryGridTemplate.argTypes = MASONRY_GRID_CONTROLS;
MasonryGridTemplate.args = {
  ...makeArgs(MasonryGridTemplate.argTypes),
};

MasonryGridTemplate.parameters = {
  preview: [
    {
      tab: "React",
      template: convertTemplate(convertPath(RawMaonsryGridApp, "react-grid", "@egjs/react-grid")),
      language: "tsx",
    },
  ],
};
