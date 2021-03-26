/* eslint-disable import/no-webpack-loader-syntax */
import * as React from "react";
import { makeArgs } from "../utils";
import MasonryGridApp from "./apps/VanillaMasonryGridApp";
import { MASONRY_GRID_CONTROLS } from "../templates/controls";
import { MasonryGrid } from "../../src";
import { renderContainer } from "../templates/ReactJSX";
import { getPreview } from "../templates/preview";
import "../templates/default.css";

export const MasonryGridTemplate = function App(props: Record<string, any>) {
  const gridRef = React.useRef<MasonryGrid | null>(null);

  React.useEffect(() => {
    gridRef.current = MasonryGridApp(props);

    return () => {
      gridRef.current!.destroy();
    };
  }, []);

  React.useEffect(() => {
    if (!gridRef.current) {
      return;
    }
    for (const name in MasonryGrid.propertyTypes) {
      if (name in props) {
        gridRef.current[name] = props[name];
      }
    }
  });
  return renderContainer();
};


MasonryGridTemplate.storyName = "MasonryGrid";
MasonryGridTemplate.argTypes = MASONRY_GRID_CONTROLS;
MasonryGridTemplate.args = { ...makeArgs(MasonryGridTemplate.argTypes) };

MasonryGridTemplate.parameters = {
  preview: getPreview("1-MasonryGrid", "MasonryGrid"),
};


