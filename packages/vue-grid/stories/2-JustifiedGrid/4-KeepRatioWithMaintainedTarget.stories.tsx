/* eslint-disable import/no-webpack-loader-syntax */
import App from "./apps/VueKeepRatioWithMaintainedTargetApp.vue";
import RawApp from "!!raw-loader!./apps/VueKeepRatioWithMaintainedTargetApp.vue";
import { JUSTIFIED_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertVueTemplate, makeArgs } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";
import { makeVueApp } from "../utils";

export const KeepRatioWithMaintainedTargetTemplate = makeVueApp(App);


KeepRatioWithMaintainedTargetTemplate.storyName = "Keep ratio with maintained target";
KeepRatioWithMaintainedTargetTemplate.argTypes = JUSTIFIED_GRID_CONTROLS;
KeepRatioWithMaintainedTargetTemplate.args = {
  ...makeArgs(KeepRatioWithMaintainedTargetTemplate.argTypes),
};

KeepRatioWithMaintainedTargetTemplate.parameters = {
  preview: [
    {
      tab: "Vue",
      template: convertVueTemplate(convertPath(RawApp, "src", "@egjs/vue-grid")),
      language: "html",
    },
  ],
};
