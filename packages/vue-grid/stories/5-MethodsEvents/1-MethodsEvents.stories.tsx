/* eslint-disable import/no-webpack-loader-syntax */
import App from "./apps/VueMethodsEventsApp.vue";
import RawApp from "!!raw-loader!./apps/VueMethodsEventsApp.vue";
import { MASONRY_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertVueTemplate, makeArgs } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";
import { makeVueApp } from "../utils";


export const MethodsEventsTemplate = makeVueApp(App);


MethodsEventsTemplate.storyName = "Use Methods & Events";
MethodsEventsTemplate.argTypes = MASONRY_GRID_CONTROLS;
MethodsEventsTemplate.args = {
  ...makeArgs(MethodsEventsTemplate.argTypes),
};

MethodsEventsTemplate.parameters = {
  preview: [
    {
      tab: "Vue",
      template: convertVueTemplate(convertPath(RawApp, "src", "@egjs/vue-grid")),
      language: "html",
    },
  ],
};
