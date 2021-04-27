/* eslint-disable import/no-webpack-loader-syntax */
import PackingGridApp from "./apps/VuePackingGridApp.vue";
import RawPackingGridApp from "!!raw-loader!./apps/VuePackingGridApp.vue";
import { PACKING_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertVueTemplate, makeArgs } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";
import { makeVueApp } from "../utils";

export const PackingGridTemplate = makeVueApp(PackingGridApp);


PackingGridTemplate.storyName = "PackingGrid";
PackingGridTemplate.argTypes = PACKING_GRID_CONTROLS;
PackingGridTemplate.args = {
  ...makeArgs(PackingGridTemplate.argTypes),
};

PackingGridTemplate.parameters = {
  preview: [
    {
      tab: "Vue",
      template: convertVueTemplate(convertPath(RawPackingGridApp, "src", "@egjs/vue-grid")),
      language: "html",
    },
  ],
};
