/* eslint-disable import/no-webpack-loader-syntax */
import MasonryGridApp from "./apps/VueMasonryGridMultipleApp.vue";
import RawMaonsryGridApp from "!!raw-loader!./apps/VueMasonryGridMultipleApp.vue";
import { MASONRY_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertVueTemplate, makeArgs } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";
import { makeVueApp } from "../utils";

export const MasonryGridMultipleTemplate = makeVueApp(MasonryGridApp);

MasonryGridMultipleTemplate.storyName = "MasonryGrid with item that place multiple columns";
MasonryGridMultipleTemplate.argTypes = MASONRY_GRID_CONTROLS;
MasonryGridMultipleTemplate.args = {
  ...makeArgs(MasonryGridMultipleTemplate.argTypes),
};

MasonryGridMultipleTemplate.parameters = {
  preview: [
    {
      tab: "Vue",
      template: convertVueTemplate(convertPath(RawMaonsryGridApp, "src", "@egjs/vue-grid")),
      language: "html",
    },
  ],
};
