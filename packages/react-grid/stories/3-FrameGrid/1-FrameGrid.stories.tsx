import FrameGridApp from "./apps/ReactFrameGridApp";
import RawFrameGridApp from "!!raw-loader!./apps/ReactFrameGridApp";
import "../../../../stories/templates/default.css";
import { FRAME_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { makeArgs, convertReactTemplate, convertPath } from "../../../../stories/utils";

export const FrameGridTemplate = FrameGridApp as any;


FrameGridTemplate.storyName = "FrameGrid";
FrameGridTemplate.argTypes = FRAME_GRID_CONTROLS;
FrameGridTemplate.args = {
  ...makeArgs(FrameGridTemplate.argTypes),
};

FrameGridTemplate.parameters = {
  preview: [
    {
      tab: "React",
      template: convertReactTemplate(convertPath(RawFrameGridApp, "react-grid", "@egjs/react-grid")),
      language: "tsx",
    },
  ],
};
