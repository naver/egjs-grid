import { JustifiedGrid } from "../../../src";

export default function App(props: Record<string, any>) {
  const grid = new JustifiedGrid(".container", {
    defaultDirection: props.defaultDirection,
    gap: props.gap,
    rowRange: props.rowRange,
    columnRange: props.columnRange,
    sizeRange: props.sizeRange,
    isCroppedSize: props.isCroppedSize,
    displayedRow: props.displayedRow,
    stretch: props.stretch,
    stretchRange: props.stretchRange,
    passUnstretchRow: props.passUnstretchRow,
  });

  grid.renderItems();

  return grid;
}
