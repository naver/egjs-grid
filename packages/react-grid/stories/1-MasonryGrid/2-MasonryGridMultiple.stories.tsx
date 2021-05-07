/* eslint-disable import/no-webpack-loader-syntax */
import MasonryGridApp from "./apps/ReactMasonryGridMultipleApp";
import RawMaonsryGridApp from "!!raw-loader!./apps/ReactMasonryGridMultipleApp";
import "../../../../stories/templates/default.css";
import { MASONRY_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertReactTemplate, makeArgs } from "../../../../stories/utils";

export const MasonryGridMultipleTemplate = MasonryGridApp as any;


MasonryGridMultipleTemplate.storyName = "MasonryGrid with item that place multiple columns";
MasonryGridMultipleTemplate.argTypes = MASONRY_GRID_CONTROLS;
MasonryGridMultipleTemplate.args = {
  ...makeArgs(MasonryGridMultipleTemplate.argTypes),
};

MasonryGridMultipleTemplate.parameters = {
  preview: [
    {
      tab: "React",
      template: convertReactTemplate(convertPath(RawMaonsryGridApp, "react-grid", "@egjs/react-grid")),
      language: "tsx",
    },
  ],
};
