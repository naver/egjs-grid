/* eslint-disable import/no-webpack-loader-syntax */
import App from "./apps/VueKeepRatioWithMaintainedTargetApp.vue";
import RawApp from "!!raw-loader!./apps/VueKeepRatioWithMaintainedTargetApp.vue";
import { JUSTIFIED_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertVueTemplate, makeArgs } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";
import { makeVueApp } from "../utils";

export const StretchedJustifiedGridTemplate = makeVueApp(App);


StretchedJustifiedGridTemplate.storyName = "Stretched Items with JustifiedGrid";
StretchedJustifiedGridTemplate.argTypes = JUSTIFIED_GRID_CONTROLS;
StretchedJustifiedGridTemplate.args = {
  ...makeArgs(StretchedJustifiedGridTemplate.argTypes),
  stretch: true,
  sizeRange: [200, 300],
};

StretchedJustifiedGridTemplate.parameters = {
  preview: [
    {
      tab: "Vue",
      template: convertVueTemplate(convertPath(RawApp, "src", "@egjs/vue-grid")),
      language: "html",
    },
  ],
};
