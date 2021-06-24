/* eslint-disable import/no-webpack-loader-syntax */
import App from "./apps/ReactMethodsEventsApp";
import RawApp from "!!raw-loader!./apps/ReactMethodsEventsApp";
import "../../../../stories/templates/default.css";
import { MASONRY_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { convertPath, convertReactTemplate, makeArgs } from "../../../../stories/utils";

export const MethodsEventsTemplate = App as any;


MethodsEventsTemplate.storyName = "Use Methods & Events";
MethodsEventsTemplate.argTypes = MASONRY_GRID_CONTROLS;
MethodsEventsTemplate.args = {
  ...makeArgs(MethodsEventsTemplate.argTypes),
};

MethodsEventsTemplate.parameters = {
  preview: [
    {
      tab: "React",
      template: convertReactTemplate(convertPath(RawApp, "react-grid", "@egjs/react-grid")),
      language: "tsx",
    },
  ],
};
