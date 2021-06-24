import App from "./apps/ReactKeepRatioWithOffsetApp";
import RawApp from "!!raw-loader!./apps/ReactKeepRatioWithOffsetApp";
import { JUSTIFIED_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { makeArgs, convertReactTemplate, convertPath } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";

export const KeepRatioWithOffsetTemplate = App.bind({}) as any;


KeepRatioWithOffsetTemplate.storyName = "Keep ratio with offset";
KeepRatioWithOffsetTemplate.argTypes = JUSTIFIED_GRID_CONTROLS;
KeepRatioWithOffsetTemplate.args = {
  ...makeArgs(KeepRatioWithOffsetTemplate.argTypes),
};

KeepRatioWithOffsetTemplate.parameters = {
  preview: [
    {
      tab: "React",
      template: convertReactTemplate(convertPath(RawApp, "react-grid", "@egjs/react-grid")),
      language: "tsx",
    },
  ],
};
