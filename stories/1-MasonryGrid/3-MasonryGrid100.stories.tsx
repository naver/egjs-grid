/* eslint-disable import/no-webpack-loader-syntax */
import * as React from "react";
import { makeArgs } from "../utils";
import MasonryGridApp from "./apps/VanillaMasonryGridApp";
import { MASONRY_GRID_CONTROLS } from "../templates/controls";
import { MasonryGrid } from "../../src";
import { getPreview } from "../templates/preview";
import "../templates/default.css";

export const MasonryGrid100Template = function App(props: Record<string, any>) {
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
    <div className={"item"} data-grid-column="0" style={{
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


MasonryGrid100Template.storyName = "MasonryGrid with item that place 100% columns";
MasonryGrid100Template.argTypes = MASONRY_GRID_CONTROLS;
MasonryGrid100Template.args = { ...makeArgs(MasonryGrid100Template.argTypes) };

MasonryGrid100Template.parameters = {
  preview: getPreview("1-MasonryGrid", "MasonryGrid100", {
    vanillaCode: require("!!raw-loader!./apps/VanillaMasonryGridApp").default,
    htmlCode: require("!!raw-loader!./templates/VanillaMasonryGrid100.html").default,
  }),
};


