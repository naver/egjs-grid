import { MasonryGrid } from "../../../src";

export default function App(props: Record<string, any>) {
  const grid = new MasonryGrid(".container", {
    defaultDirection: props.defaultDirection,
    gap: props.gap,
    align: props.align,
    column: props.column,
    columnSize: props.columnSize,
    columnSizeRatio: props.columnSizeRatio,
  });
  grid.renderItems();

  return grid;
}
