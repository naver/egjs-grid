/* eslint-disable import/no-webpack-loader-syntax */
import MasonryGridApp from "./apps/VueMasonryGrid100App.vue";
import RawMaonsryGridApp from "!!raw-loader!./apps/VueMasonryGrid100App.vue";
import { MASONRY_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertVueTemplate, makeArgs } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";

export const MasonryGrid100Template = () => MasonryGridApp;


MasonryGrid100Template.storyName = "MasonryGrid with item that place 100% columns";
MasonryGrid100Template.argTypes = MASONRY_GRID_CONTROLS;
MasonryGrid100Template.args = {
  ...makeArgs(MasonryGrid100Template.argTypes),
};

MasonryGrid100Template.parameters = {
  preview: [
    {
      tab: "Vue",
      template: convertVueTemplate(convertPath(RawMaonsryGridApp, "src", "@egjs/vue-grid")),
      language: "html",
    },
  ],
};
