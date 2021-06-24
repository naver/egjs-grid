/* eslint-disable import/no-webpack-loader-syntax */
import * as React from "react";
import { makeArgs } from "../utils";
import JustifiedGridApp from "./apps/VanillaJustifiedGridApp";
import { CROPPED_JUSTIFIED_GRID_CONTROLS } from "../templates/controls";
import { JustifiedGrid } from "../../src";
import { renderContainer } from "../templates/ReactJSX";
import "../templates/default.css";
import { getPreview } from "../templates/preview";

export const CroppedJustifiedGridTemplate = function App(props: Record<string, any>) {
  const gridRef = React.useRef<JustifiedGrid | null>(null);

  React.useEffect(() => {
    gridRef.current = JustifiedGridApp(props);

    return () => {
      gridRef.current!.destroy();
    };
  }, []);

  React.useEffect(() => {
    if (!gridRef.current) {
      return;
    }
    for (const name in JustifiedGrid.propertyTypes) {
      if (name in props) {
        gridRef.current[name] = props[name];
      }
    }
  });
  return renderContainer();
};


CroppedJustifiedGridTemplate.storyName = "Cropped JustifiedGrid";
CroppedJustifiedGridTemplate.argTypes = CROPPED_JUSTIFIED_GRID_CONTROLS;
CroppedJustifiedGridTemplate.args = { ...makeArgs(CroppedJustifiedGridTemplate.argTypes) };

CroppedJustifiedTemplate.parameters = {
  preview: getPreview("2-JustifiedGrid", "JustifiedGrid"),
};
