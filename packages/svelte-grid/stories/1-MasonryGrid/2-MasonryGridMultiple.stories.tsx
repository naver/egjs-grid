import MasonryGridApp from "./apps/SvelteMasonryGridMultipleApp.svelte";
import RawMasonryGridApp from "!!raw-loader!./apps/SvelteMasonryGridMultipleApp.svelte";
import { MASONRY_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertSvelteTemplate, makeArgs } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";


export const MasonryGridMultipleTemplate = (props) => ({
  Component: MasonryGridApp,
  props,
});

MasonryGridMultipleTemplate.storyName = "MasonryGrid with item that place multiple columns";
MasonryGridMultipleTemplate.argTypes = MASONRY_GRID_CONTROLS;
MasonryGridMultipleTemplate.args = {
  ...makeArgs(MasonryGridMultipleTemplate.argTypes),
};

MasonryGridMultipleTemplate.parameters = {
  preview: [
    {
      tab: "Svelte",
      template: convertSvelteTemplate(convertPath(RawMasonryGridApp, "src", "@egjs/svelte-grid")),
      language: "html",
    },
  ],
};
