import MasonryGridApp from "./apps/SvelteMasonryGridApp.svelte";
import RawMasonryGridApp from "!!raw-loader!./apps/SvelteMasonryGridApp.svelte";
import { MASONRY_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertSvelteTemplate, makeArgs } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";


export const MasonryGridTemplate = (props) => ({
  Component: MasonryGridApp,
  props,
});

MasonryGridTemplate.storyName = "MasonryGrid";
MasonryGridTemplate.argTypes = MASONRY_GRID_CONTROLS;
MasonryGridTemplate.args = {
  ...makeArgs(MasonryGridTemplate.argTypes),
};

MasonryGridTemplate.parameters = {
  preview: [
    {
      tab: "Svelte",
      template: convertSvelteTemplate(convertPath(RawMasonryGridApp, "src", "@egjs/svelte-grid")),
      language: "html",
    },
  ],
};
