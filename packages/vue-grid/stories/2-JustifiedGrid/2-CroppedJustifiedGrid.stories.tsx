/* eslint-disable import/no-webpack-loader-syntax */
import JustifiedGridApp from "./apps/VueJustifiedGridApp.vue";
import RawJustifiedGridApp from "!!raw-loader!./apps/VueJustifiedGridApp.vue";
import { CROPPED_JUSTIFIED_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertVueTemplate, makeArgs } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";
import { makeVueApp } from "../utils";

export const CroppedJustifiedGridTemplate = makeVueApp(JustifiedGridApp);


CroppedJustifiedGridTemplate.storyName = "Cropped JustifiedGrid";
CroppedJustifiedGridTemplate.argTypes = CROPPED_JUSTIFIED_GRID_CONTROLS;
CroppedJustifiedGridTemplate.args = {
  ...makeArgs(CroppedJustifiedGridTemplate.argTypes),
};

CroppedJustifiedGridTemplate.parameters = {
  preview: [
    {
      tab: "Vue",
      template: convertVueTemplate(convertPath(RawJustifiedGridApp, "src", "@egjs/vue-grid")),
      language: "html",
    },
  ],
};
