/* eslint-disable import/no-webpack-loader-syntax */
import * as React from "react";
import App from "./apps/VanillaMethodsEventsApp";
import { MASONRY_GRID_CONTROLS } from "../templates/controls";
import "../templates/default.css";
import { getPreview } from "../templates/preview";
import { makeArgs } from "../utils";
import { getApp } from "../templates/ReactJSX";
import { MasonryGrid } from "../../src";

export const MethodsEventsTemplate = getApp(MasonryGrid, App, () => {
  return <div className="root">
    <div className="result"></div>
    <button className="button">Resize Item 2</button>
    <div className="container">
      <div className={"item"}>1</div>
      <div className={"item item2"}>2</div>
      <div className={"item"}>3</div>
      <div className={"item"}>4</div>
      <div className={"item"}>5</div>
      <div className={"item"}>6</div>
      <div className={"item"}>7</div>
      <div className={"item"}>8</div>
      <div className={"item"}>9</div>
      <div className={"item"}>10</div>
    </div>
  </div>;
});

MethodsEventsTemplate.storyName = "Use Methods & Events";
MethodsEventsTemplate.argTypes = MASONRY_GRID_CONTROLS;
MethodsEventsTemplate.args = {
  ...makeArgs(MethodsEventsTemplate.argTypes),
};

MethodsEventsTemplate.parameters = {
  preview: getPreview("5-MethodsEvents", "MethodsEvents", {
    htmlCode: require("!!raw-loader!./templates/VanillaMethodsEvents.html").default,
  }),
};
