import JustifiedGridApp from "./apps/SvelteKeepRatioWithMaintainedTargetApp.svelte";
import RawJustifiedGridApp from "!!raw-loader!./apps/SvelteKeepRatioWithMaintainedTargetApp.svelte";
import { JUSTIFIED_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertSvelteTemplate, makeArgs } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";

export const StretchedJustifiedGridTemplate = (props) => ({
  Component: JustifiedGridApp,
  props,
});

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
      tab: "Svelte",
      template: convertSvelteTemplate(convertPath(RawJustifiedGridApp, "src", "@egjs/svelte-grid")),
      language: "html",
    },
  ],
};
