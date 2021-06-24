import JustifiedGridApp from "./apps/SvelteJustifiedGridApp.svelte";
import RawJustifiedGridApp from "!!raw-loader!./apps/SvelteJustifiedGridApp.svelte";
import { CROPPED_JUSTIFIED_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertSvelteTemplate, makeArgs } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";

export const CroppedJustifiedGridTemplate = (props) => ({
  Component: JustifiedGridApp,
  props,
});

CroppedJustifiedGridTemplate.storyName = "Cropped JustifiedGrid";
CroppedJustifiedGridTemplate.argTypes = CROPPED_JUSTIFIED_GRID_CONTROLS;
CroppedJustifiedGridTemplate.args = {
  ...makeArgs(CroppedJustifiedGridTemplate.argTypes),
};

CroppedJustifiedGridTemplate.parameters = {
  preview: [
    {
      tab: "Svelte",
      template: convertSvelteTemplate(convertPath(RawJustifiedGridApp, "src", "@egjs/svelte-grid")),
      language: "html",
    },
  ],
};
