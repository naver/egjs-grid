import JustifiedGridApp from "./apps/SvelteKeepRatioWithOffsetApp.svelte";
import RawJustifiedGridApp from "!!raw-loader!./apps/SvelteKeepRatioWithOffsetApp.svelte";
import { JUSTIFIED_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertSvelteTemplate, makeArgs } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";

export const KeepRatioWithOffsetTemplate = (props) => ({
  Component: JustifiedGridApp,
  props,
});

KeepRatioWithOffsetTemplate.storyName = "Keep ratio with offset";
KeepRatioWithOffsetTemplate.argTypes = JUSTIFIED_GRID_CONTROLS;
KeepRatioWithOffsetTemplate.args = {
  ...makeArgs(KeepRatioWithOffsetTemplate.argTypes),
};

KeepRatioWithOffsetTemplate.parameters = {
  preview: [
    {
      tab: "Svelte",
      template: convertSvelteTemplate(convertPath(RawJustifiedGridApp, "src", "@egjs/svelte-grid")),
      language: "html",
    },
  ],
};
