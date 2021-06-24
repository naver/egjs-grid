import App from "./apps/ReactJustifiedGridApp";
import RawApp from "!!raw-loader!./apps/ReactJustifiedGridApp";
import { CROPPED_JUSTIFIED_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { makeArgs, convertReactTemplate, convertPath } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";

export const CroppedJustifiedGridTemplate = App.bind({}) as any;


CroppedJustifiedGridTemplate.storyName = "Cropped JustifiedGrid";
CroppedJustifiedGridTemplate.argTypes = CROPPED_JUSTIFIED_GRID_CONTROLS;
CroppedJustifiedGridTemplate.args = {
  ...makeArgs(CroppedJustifiedGridTemplate.argTypes),
};

CroppedJustifiedGridTemplate.parameters = {
  preview: [
    {
      tab: "React",
      template: convertReactTemplate(convertPath(RawApp, "react-grid", "@egjs/react-grid")),
      language: "tsx",
    },
  ],
};
