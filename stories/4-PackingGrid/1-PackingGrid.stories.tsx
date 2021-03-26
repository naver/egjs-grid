/* eslint-disable import/no-webpack-loader-syntax */
import * as React from "react";
import { makeArgs } from "../utils";
import PackingGridApp from "./apps/VanillaPackingGridApp";
import { PACKING_GRID_CONTROLS } from "../templates/controls";
import { PackingGrid } from "../../src";
import { renderContainer } from "../templates/ReactJSX";
import "../templates/default.css";
import { getPreview } from "../templates/preview";

export const PackingGridTemplate = function App(props: Record<string, any>) {
  const gridRef = React.useRef<PackingGrid | null>(null);

  React.useEffect(() => {
    gridRef.current = PackingGridApp(props);

    return () => {
      gridRef.current!.destroy();
    };
  }, []);

  React.useEffect(() => {
    if (!gridRef.current) {
      return;
    }
    for (const name in PackingGrid.propertyTypes) {
      if (name in props) {
        gridRef.current[name] = props[name];
      }
    }
  });
  return renderContainer();
};


PackingGridTemplate.storyName = "PackingGrid";
PackingGridTemplate.argTypes = PACKING_GRID_CONTROLS;
PackingGridTemplate.args = { ...makeArgs(PackingGridTemplate.argTypes) };

PackingGridTemplate.parameters = {
  preview: getPreview("4-PackingGrid", "PackingGrid"),
};
