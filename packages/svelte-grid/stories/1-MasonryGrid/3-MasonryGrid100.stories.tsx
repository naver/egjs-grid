import MasonryGridApp from "./apps/SvelteMasonryGrid100App.svelte";
import RawMasonryGridApp from "!!raw-loader!./apps/SvelteMasonryGrid100App.svelte";
import { MASONRY_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertSvelteTemplate, makeArgs } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";


export const MasonryGrid100Template = (props) => ({
  Component: MasonryGridApp,
  props,
});

MasonryGrid100Template.storyName = "MasonryGrid with item that place 100% columns";
MasonryGrid100Template.argTypes = MASONRY_GRID_CONTROLS;
MasonryGrid100Template.args = {
  ...makeArgs(MasonryGrid100Template.argTypes),
};

MasonryGrid100Template.parameters = {
  preview: [
    {
      tab: "Svelte",
      template: convertSvelteTemplate(convertPath(RawMasonryGridApp, "src", "@egjs/svelte-grid")),
      language: "html",
    },
  ],
};
