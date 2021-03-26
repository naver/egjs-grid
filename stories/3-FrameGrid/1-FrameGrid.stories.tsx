/* eslint-disable import/no-webpack-loader-syntax */
import * as React from "react";
import { makeArgs } from "../utils";
import FrameGridApp from "./apps/VanillaFrameGridApp";
import { FRAME_GRID_CONTROLS } from "../templates/controls";
import { FrameGrid } from "../../src";
import { renderContainer } from "../templates/ReactJSX";
import "../templates/default.css";
import { getPreview } from "../templates/preview";

export const FrameGridTemplate = function App(props: Record<string, any>) {
  const gridRef = React.useRef<FrameGrid | null>(null);

  React.useEffect(() => {
    gridRef.current = FrameGridApp(props);

    return () => {
      gridRef.current!.destroy();
    };
  }, []);

  React.useEffect(() => {
    if (!gridRef.current) {
      return;
    }
    for (const name in FrameGrid.propertyTypes) {
      if (name in props) {
        gridRef.current[name] = props[name];
      }
    }
  });
  return renderContainer();
};


FrameGridTemplate.storyName = "FrameGrid";
FrameGridTemplate.argTypes = FRAME_GRID_CONTROLS;
FrameGridTemplate.args = { ...makeArgs(FrameGridTemplate.argTypes) };

FrameGridTemplate.parameters = {
  preview: getPreview("3-FrameGrid", "FrameGrid"),
};
