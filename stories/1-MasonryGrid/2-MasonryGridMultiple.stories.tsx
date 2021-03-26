/* eslint-disable import/no-webpack-loader-syntax */
import * as React from "react";
import { makeArgs } from "../utils";
import MasonryGridApp from "./apps/VanillaMasonryGridApp";
import { MASONRY_GRID_CONTROLS } from "../templates/controls";
import { MasonryGrid } from "../../src";
import { getPreview } from "../templates/preview";
import "../templates/default.css";

export const MasonryGridMultipleTemplate = function App(props: Record<string, any>) {
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
  return <div className="container">
    <div className={"item"} data-grid-column="4" style={{
      width: "100%",
    }}>1</div>
    <div className={"item"}>2</div>
    <div className={"item"}>3</div>
    <div className={"item"}>4</div>
    <div className={"item"}>5</div>
    <div className={"item"}>6</div>
    <div className={"item"}>7</div>
    <div className={"item"}>8</div>
    <div className={"item"}>9</div>
    <div className={"item"}>10</div>
  </div>;
};


MasonryGridMultipleTemplate.storyName = "MasonryGrid with item that place multiple columns";
MasonryGridMultipleTemplate.argTypes = MASONRY_GRID_CONTROLS;
MasonryGridMultipleTemplate.args = { ...makeArgs(MasonryGridMultipleTemplate.argTypes) };

MasonryGridMultipleTemplate.parameters = {
  preview: getPreview("1-MasonryGrid", "MasonryGridMultiple", {
    vanillaCode: require("!!raw-loader!./apps/VanillaMasonryGridApp").default,
    htmlCode: require("!!raw-loader!./templates/VanillaMasonryGridMultiple.html").default,
  }),
};


