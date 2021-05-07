import PackingGridApp from "./apps/ReactPackingGridApp";
import RawPackingGridApp from "!!raw-loader!./apps/ReactPackingGridApp";
import { PACKING_GRID_CONTROLS } from "../../../../stories/templates/controls";
import { makeArgs, convertReactTemplate, convertPath } from "../../../../stories/utils";
import "../../../../stories/templates/default.css";

export const PackingGridTemplate = PackingGridApp as any;


PackingGridTemplate.storyName = "PackingGrid";
PackingGridTemplate.argTypes = PACKING_GRID_CONTROLS;
PackingGridTemplate.args = {
  ...makeArgs(PackingGridTemplate.argTypes),
};

PackingGridTemplate.parameters = {
  preview: [
    {
      tab: "React",
      template: convertReactTemplate(convertPath(RawPackingGridApp, "react-grid", "@egjs/react-grid")),
      language: "tsx",
    },
  ],
};
