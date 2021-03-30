import * as React from "react";
import Grid, { GridFunction } from "../../src";

export function renderContainer() {
  return <div className="container">
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
  </div>;
}

export function getApp(
  gridFunc: GridFunction,
  appFunc: (props: Record<string, any>) => Grid,
  containerFunc: () => JSX.Element,
) {
  function App(props: Record<string, any>) {
    const gridRef = React.useRef<Grid | null>(null);

    React.useEffect(() => {
      gridRef.current = appFunc(props);

      return () => {
        gridRef.current!.destroy();
      };
    }, []);

    return containerFunc();
  }

  return function render (props: Record<string, any>) {
    return <App key={Math.random()} {...props}/>;
  }.bind({});
}
