import App from "./apps/SvelteMethodsEventsApp.svelte";
import RawApp from "!!raw-loader!./apps/SvelteMethodsEventsApp.svelte";
import { MASONRY_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertSvelteTemplate, makeArgs } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";


export const MethodsEventsTemplate = (props) => ({
  Component: App,
  props,
});

MethodsEventsTemplate.storyName = "Use Methods & Events";
MethodsEventsTemplate.argTypes = MASONRY_GRID_CONTROLS;
MethodsEventsTemplate.args = {
  ...makeArgs(MethodsEventsTemplate.argTypes),
};

MethodsEventsTemplate.parameters = {
  preview: [
    {
      tab: "Svelte",
      template: convertSvelteTemplate(convertPath(RawApp, "src", "@egjs/svelte-grid")),
      language: "html",
    },
  ],
};
