/* eslint-disable import/no-webpack-loader-syntax */
import App from "./apps/VueKeepRatioWithOffsetApp.vue";
import RawApp from "!!raw-loader!./apps/VueKeepRatioWithOffsetApp.vue";
import { JUSTIFIED_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertVueTemplate, makeArgs } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";
import { makeVueApp } from "../utils";

export const KeepRatioWithOffsetTemplate = makeVueApp(App);


KeepRatioWithOffsetTemplate.storyName = "Keep ratio with offset";
KeepRatioWithOffsetTemplate.argTypes = JUSTIFIED_GRID_CONTROLS;
KeepRatioWithOffsetTemplate.args = {
  ...makeArgs(KeepRatioWithOffsetTemplate.argTypes),
};

KeepRatioWithOffsetTemplate.parameters = {
  preview: [
    {
      tab: "Vue",
      template: convertVueTemplate(convertPath(RawApp, "src", "@egjs/vue-grid")),
      language: "html",
    },
  ],
};
