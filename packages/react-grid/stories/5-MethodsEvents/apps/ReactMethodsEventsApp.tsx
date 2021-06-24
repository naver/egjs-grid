import React from "react";
import { MasonryGrid } from "../../../src";

export default function App(props: Record<string, any>) {
  const resultRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<MasonryGrid>(null);

  return (<div className="root">
    <div className="result" ref={resultRef}></div>
    <button className="button" onClick={() => {
      const items = gridRef.current!.getItems();

      items[1].element!.style.height = "150px";
      gridRef.current!.updateItems([items[1]]);
    }}>Resize Item 2</button>
    <MasonryGrid
      ref={gridRef}
      className="container"
      gap={props.gap}
      defaultDirection={props.defaultDirection}
      align={props.align}
      column={props.column}
      columnSize={props.columnSize}
      columnSizeRatio={props.columnSizeRatio}
      key={Math.random()}
      onRenderComplete={(e) => {
        resultRef.current!.innerHTML = `updated: ${e.updated.length}`;
      }}>
      <div className="item">1</div>
      <div className="item item2">2</div>
      <div className="item">3</div>
      <div className="item">4</div>
      <div className="item">5</div>
      <div className="item">6</div>
      <div className="item">7</div>
      <div className="item">8</div>
      <div className="item">9</div>
      <div className="item">10</div>
    </MasonryGrid>
  </div>);
}
