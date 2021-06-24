import JustifiedGridApp from "./apps/ReactJustifiedGridApp";
import ReactJustifiedGridApp from "!!raw-loader!./apps/ReactJustifiedGridApp";
import { JUSTIFIED_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { makeArgs, convertReactTemplate, convertPath } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";

export const JustifiedGridTemplate = JustifiedGridApp.bind({}) as any;


JustifiedGridTemplate.storyName = "JustifiedGrid";
JustifiedGridTemplate.argTypes = JUSTIFIED_GRID_CONTROLS;
JustifiedGridTemplate.args = {
  ...makeArgs(JustifiedGridTemplate.argTypes),
};

JustifiedGridTemplate.parameters = {
  preview: [
    {
      tab: "React",
      template: convertReactTemplate(convertPath(ReactJustifiedGridApp, "react-grid", "@egjs/react-grid")),
      language: "tsx",
    },
  ],
};
