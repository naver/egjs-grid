import App from "./apps/ReactKeepRatioWithMaintainedTargetApp";
import RawApp from "!!raw-loader!./apps/ReactKeepRatioWithMaintainedTargetApp";
import { JUSTIFIED_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { makeArgs, convertReactTemplate, convertPath } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";

export const KeepRatioWithMaintainedTargetTemplate = App.bind({}) as any;


KeepRatioWithMaintainedTargetTemplate.storyName = "Keep ratio with maintained target";
KeepRatioWithMaintainedTargetTemplate.argTypes = JUSTIFIED_GRID_CONTROLS;
KeepRatioWithMaintainedTargetTemplate.args = {
  ...makeArgs(KeepRatioWithMaintainedTargetTemplate.argTypes),
};

KeepRatioWithMaintainedTargetTemplate.parameters = {
  preview: [
    {
      tab: "React",
      template: convertReactTemplate(convertPath(RawApp, "react-grid", "@egjs/react-grid")),
      language: "tsx",
    },
  ],
};
