import JustifiedGridApp from "./apps/SvelteJustifiedGridApp.svelte";
import RawJustifiedGridApp from "!!raw-loader!./apps/SvelteJustifiedGridApp.svelte";
import { JUSTIFIED_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertSvelteTemplate, makeArgs } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";

export const JustifiedGridTemplate = (props) => ({
  Component: JustifiedGridApp,
  props,
});

JustifiedGridTemplate.storyName = "JustifiedGrid";
JustifiedGridTemplate.argTypes = JUSTIFIED_GRID_CONTROLS;
JustifiedGridTemplate.args = {
  ...makeArgs(JustifiedGridTemplate.argTypes),
};

JustifiedGridTemplate.parameters = {
  preview: [
    {
      tab: "Svelte",
      template: convertSvelteTemplate(convertPath(RawJustifiedGridApp, "src", "@egjs/svelte-grid")),
      language: "html",
    },
  ],
};
