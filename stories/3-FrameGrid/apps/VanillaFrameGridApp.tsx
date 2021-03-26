import { FrameGrid } from "../../../src";

export default function App(props: Record<string, any>) {
  const grid = new FrameGrid(".container", {
    defaultDirection: props.defaultDirection,
    gap: props.gap,
    frame: props.frame,
    rectSize: props.rectSize,
  });

  grid.renderItems();

  return grid;
}
