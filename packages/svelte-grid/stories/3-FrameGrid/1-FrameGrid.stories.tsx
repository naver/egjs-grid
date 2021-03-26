import FrameGridApp from "./apps/SvelteFrameGridApp.svelte";
import RawFrameGridApp from "!!raw-loader!./apps/SvelteFrameGridApp.svelte";
import { FRAME_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertSvelteTemplate, makeArgs } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";

export const FrameGridTemplate = (props) => ({
  Component: FrameGridApp,
  props,
});

FrameGridTemplate.storyName = "FrameGrid";
FrameGridTemplate.argTypes = FRAME_GRID_CONTROLS;
FrameGridTemplate.args = {
  ...makeArgs(FrameGridTemplate.argTypes),
};

FrameGridTemplate.parameters = {
  preview: [
    {
      tab: "Svelte",
      template: convertSvelteTemplate(convertPath(RawFrameGridApp, "src", "@egjs/svelte-grid")),
      language: "html",
    },
  ],
};
