import { PackingGrid } from "../../../src";

export default function App(props: Record<string, any>) {
  const grid = new PackingGrid(".container", {
    defaultDirection: props.defaultDirection,
    gap: props.gap,
    sizeWeight: props.sizeWeight,
    ratioWeight: props.ratioWeight,
    aspectRatio: props.aspectRatio,
  });

  grid.renderItems();

  return grid;
}
