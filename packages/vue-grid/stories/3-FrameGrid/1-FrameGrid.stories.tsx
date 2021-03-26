/* eslint-disable import/no-webpack-loader-syntax */
import FrameGridApp from "./apps/VueFrameGridApp.vue";
import RawFrameGridApp from "!!raw-loader!./apps/VueFrameGridApp.vue";
import { FRAME_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertVueTemplate, makeArgs } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";

export const FrameGridTemplate = () => FrameGridApp;


FrameGridTemplate.storyName = "FrameGrid";
FrameGridTemplate.argTypes = FRAME_GRID_CONTROLS;
FrameGridTemplate.args = {
  ...makeArgs(FrameGridTemplate.argTypes),
};

FrameGridTemplate.parameters = {
  preview: [
    {
      tab: "Vue",
      template: convertVueTemplate(convertPath(RawFrameGridApp, "src", "@egjs/vue-grid")),
      language: "html",
    },
  ],
};
