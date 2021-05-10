import React from "react";
import { MasonryGrid } from "../../../src";

export default function App(props: Record<string, any>) {
  return <MasonryGrid
    className="container"
    gap={props.gap}
    defaultDirection={props.defaultDirection}
    align={props.align}
    column={props.column}
    columnSize={props.columnSize}
    columnSizeRatio={props.columnSizeRatio}
    key={Math.random()}
  >
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
  </MasonryGrid>;
}
