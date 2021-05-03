import { MasonryGrid } from "../../../src";
import { CFCScenario } from "./utils";

Feature('Test MasonryGrid(100% Column)');

const storyId = "examples-masonrygrid--masonry-grid-100-template";


const {
  add,
  execute,
} = CFCScenario<typeof MasonryGrid>(storyId, {
  gap: 5,
  align: "justify",
  column: 0,
  columnSize: 0,
  columnSizeRatio: 0,
});


add("Initialization", async ({ seeVisualDiffWithScreenshot }) => {
  seeVisualDiffWithScreenshot("masonrygrid-100-column-default.png");
});

["start", "center", "end", "justify", "stretch"].forEach((align) => {
  add(`test algin: "${align}"`, async ({ seeVisualDiffWithScreenshot, updateArgs }) => {
    await updateArgs({ align });
    seeVisualDiffWithScreenshot(`masonrygrid-100-column-align-${align}.png`);
  });

  [1, 2, 3].forEach((column) => {
    add(`test algin: "${align}", column: ${column}`, async ({ seeVisualDiffWithScreenshot, updateArgs }) => {
      await updateArgs({ align, column });
      seeVisualDiffWithScreenshot(`masonrygrid-100-column-align-${align}-column-${column}.png`);
    });
  });
});
[0, 100].forEach((columnSize) => {
  add(`test columnSize: ${columnSize}`, async ({ seeVisualDiffWithScreenshot, updateArgs }) => {
    await updateArgs({ columnSize });
    seeVisualDiffWithScreenshot(`masonrygrid-100-column-columnSize-${columnSize}.png`);
  });
  [0, 0.5, 1, 2].forEach((columnSizeRatio) => {
    add(`test columnSize: ${columnSize}, columnSizeRatio: ${columnSizeRatio}`, async ({ seeVisualDiffWithScreenshot, updateArgs }) => {
      await updateArgs({ columnSize, columnSizeRatio });
      seeVisualDiffWithScreenshot(`masonrygrid-100-column-columnSize-${columnSize}-columnSizeRatio-${columnSizeRatio}.png`);
    });
  });
});

execute();
