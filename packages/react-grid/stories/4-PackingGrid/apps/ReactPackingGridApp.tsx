import React from "react";
import { PackingGrid } from "../../../src";

export default function App(props: Record<string, any>) {
  return <PackingGrid
    className="container"
    gap={props.gap}
    defaultDirection={props.defaultDirection}
    sizeWeight={props.sizeWeight}
    ratioWeight={props.ratioWeight}
    aspectRatio={props.aspectRatio}
    weightPriority={props.weightPriority}
  >
    <div className={"item"}>1</div>
    <div className={"item"}>2</div>
    <div className={"item"}>3</div>
    <div className={"item"}>4</div>
    <div className={"item"}>5</div>
    <div className={"item"}>6</div>
    <div className={"item"}>7</div>
    <div className={"item"}>8</div>
    <div className={"item"}>9</div>
    <div className={"item"}>10</div>
  </PackingGrid>;
}
