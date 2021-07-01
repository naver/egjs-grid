import JustifiedGridApp from "./apps/SvelteKeepRatioWithMaintainedTargetApp.svelte";
import RawJustifiedGridApp from "!!raw-loader!./apps/SvelteKeepRatioWithMaintainedTargetApp.svelte";
import { JUSTIFIED_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertSvelteTemplate, makeArgs } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";

export const KeepRatioWithMaintainedTargetTemplate = (props) => ({
  Component: JustifiedGridApp,
  props,
});

KeepRatioWithMaintainedTargetTemplate.storyName = "Keep ratio with offset";
KeepRatioWithMaintainedTargetTemplate.argTypes = JUSTIFIED_GRID_CONTROLS;
KeepRatioWithMaintainedTargetTemplate.args = {
  ...makeArgs(KeepRatioWithMaintainedTargetTemplate.argTypes),
};

KeepRatioWithMaintainedTargetTemplate.parameters = {
  preview: [
    {
      tab: "Svelte",
      template: convertSvelteTemplate(convertPath(RawJustifiedGridApp, "src", "@egjs/svelte-grid")),
      language: "html",
    },
  ],
};
