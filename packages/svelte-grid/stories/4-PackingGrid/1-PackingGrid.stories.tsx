import PackingGridApp from "./apps/SveltePackingGridApp.svelte";
import RawPackingGridApp from "!!raw-loader!./apps/SveltePackingGridApp.svelte";
import { PACKING_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertSvelteTemplate, makeArgs } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";

export const PackingGridTemplate = (props) => ({
  Component: PackingGridApp,
  props,
});

PackingGridTemplate.storyName = "PackingGrid";
PackingGridTemplate.argTypes = PACKING_GRID_CONTROLS;
PackingGridTemplate.args = {
  ...makeArgs(PackingGridTemplate.argTypes),
};

PackingGridTemplate.parameters = {
  preview: [
    {
      tab: "Svelte",
      template: convertSvelteTemplate(convertPath(RawPackingGridApp, "src", "@egjs/svelte-grid")),
      language: "html",
    },
  ],
};
