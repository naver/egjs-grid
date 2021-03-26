import { JustifiedGrid } from "../../../src";

export default function App(props: Record<string, any>) {
  const grid = new JustifiedGrid(".container", {
    defaultDirection: props.defaultDirection,
    gap: props.gap,
    rowRange: props.rowRange,
    columnRange: props.columnRange,
    sizeRange: props.sizeRange,
  });

  grid.renderItems();

  return grid;
}
