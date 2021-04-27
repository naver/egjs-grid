/* eslint-disable import/no-webpack-loader-syntax */
import MasonryGridApp from "./apps/VueMasonryGridApp.vue";
import RawMaonsryGridApp from "!!raw-loader!./apps/VueMasonryGridApp.vue";
import { MASONRY_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertVueTemplate, makeArgs } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";
import { makeVueApp } from "../utils";


export const MasonryGridTemplate = makeVueApp(MasonryGridApp);


MasonryGridTemplate.storyName = "MasonryGrid";
MasonryGridTemplate.argTypes = MASONRY_GRID_CONTROLS;
MasonryGridTemplate.args = {
  ...makeArgs(MasonryGridTemplate.argTypes),
};

MasonryGridTemplate.parameters = {
  preview: [
    {
      tab: "Vue",
      template: convertVueTemplate(convertPath(RawMaonsryGridApp, "src", "@egjs/vue-grid")),
      language: "html",
    },
  ],
};
