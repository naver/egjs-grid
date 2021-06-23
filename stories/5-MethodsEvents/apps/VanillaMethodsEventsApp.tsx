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

  grid.on("renderComplete", (e) => {
    document.querySelector(".result")!.innerHTML = `updated: ${e.updated.length}`;
  });

  grid.renderItems();

  document.querySelector(".button")!.addEventListener("click", () => {
    const items = grid.getItems();

    items[1].element!.style.height = "150px";
    grid.updateItems([items[1]]);
  });

  return grid;
}
