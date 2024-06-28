import App from "./apps/ReactKeepRatioWithMaintainedTargetApp";
import RawApp from "!!raw-loader!./apps/ReactKeepRatioWithMaintainedTargetApp";
import { JUSTIFIED_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { makeArgs, convertReactTemplate, convertPath } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";

export const StretchedJustifiedGridTemplate = App.bind({}) as any;


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
      tab: "React",
      template: convertReactTemplate(convertPath(RawApp, "react-grid", "@egjs/react-grid")),
      language: "tsx",
    },
  ],
};
