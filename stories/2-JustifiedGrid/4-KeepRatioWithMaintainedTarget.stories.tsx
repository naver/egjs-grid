/* eslint-disable import/no-webpack-loader-syntax */
import * as React from "react";
import { makeArgs } from "../utils";
import JustifiedGridApp from "./apps/VanillaJustifiedGridApp";
import { JUSTIFIED_GRID_CONTROLS } from "../templates/controls";
import { JustifiedGrid } from "../../src";
import { getApp } from "../templates/ReactJSX";
import "../templates/default.css";
import { getPreview } from "../templates/preview";

export const KeepRatioWithMaintainedTargetTemplate = getApp(JustifiedGrid, JustifiedGridApp, () => {
  return <div className="container">
    <div className="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/1.jpg"
        data-grid-maintained-target="" alt="image1" />
      <div className="title">Item 1</div>
    </div>
    <div className="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/2.jpg"
        data-grid-maintained-target="" alt="image2" />
      <div className="title">Item 2</div>
    </div>
    <div className="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/3.jpg"
        data-grid-maintained-target="" alt="image3" />
      <div className="title">Item 3</div>
    </div>
    <div className="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/4.jpg"
        data-grid-maintained-target="" alt="image4" />
      <div className="title">Item 4</div>
    </div>
    <div className="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/5.jpg"
        data-grid-maintained-target="" alt="image5" />
      <div className="title">Item 5</div>
    </div>
    <div className="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/6.jpg"
        data-grid-maintained-target="" alt="image6" />
      <div className="title">Item 6</div>
    </div>
    <div className="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/7.jpg"
        data-grid-maintained-target="" alt="image7" />
      <div className="title">Item 7</div>
    </div>
    <div className="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/8.jpg"
        data-grid-maintained-target="" alt="image8" />
      <div className="title">Item 8</div>
    </div>
    <div className="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/9.jpg"
        data-grid-maintained-target="" alt="image9" />
      <div className="title">Item 9</div>
    </div>
    <div className="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/10.jpg"
        data-grid-maintained-target="" alt="image10" />
      <div className="title">Item 10</div>
    </div>
  </div>;
});


KeepRatioWithMaintainedTargetTemplate.storyName = "Keep ratio width maintained target";
KeepRatioWithMaintainedTargetTemplate.argTypes = JUSTIFIED_GRID_CONTROLS;
KeepRatioWithMaintainedTargetTemplate.args = { ...makeArgs(KeepRatioWithMaintainedTargetTemplate.argTypes) };

KeepRatioWithMaintainedTargetTemplate.parameters = {
  preview: getPreview("2-JustifiedGrid", "KeepRatioWithMaintainedTarget", {
    vanillaCode: require("!!raw-loader!./apps/VanillaJustifiedGridApp.tsx").default,
    htmlCode: require("!!raw-loader!./templates/VanillaKeepRatioWithMaintainedTarget.html").default,
  }),
};
