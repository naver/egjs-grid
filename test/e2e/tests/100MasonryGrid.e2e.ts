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


add("Initialization", async ({ seeJSONDiffWithScreenshot }) => {
  seeJSONDiffWithScreenshot("masonrygrid-100-column-default.json");
});

["start", "center", "end", "justify", "stretch"].forEach((align) => {
  add(`test algin: "${align}"`, async ({ seeJSONDiffWithScreenshot, updateArgs }) => {
    await updateArgs({ align });
    seeJSONDiffWithScreenshot(`masonrygrid-100-column-align-${align}.json`);
  });

  [1, 2, 3].forEach((column) => {
    add(`test algin: "${align}", column: ${column}`, async ({ seeJSONDiffWithScreenshot, updateArgs }) => {
      await updateArgs({ align, column });
      seeJSONDiffWithScreenshot(`masonrygrid-100-column-align-${align}-column-${column}.json`);
    });
  });
});
[0, 100].forEach((columnSize) => {
  add(`test columnSize: ${columnSize}`, async ({ seeJSONDiffWithScreenshot, updateArgs }) => {
    await updateArgs({ columnSize });
    seeJSONDiffWithScreenshot(`masonrygrid-100-column-columnSize-${columnSize}.json`);
  });
  [0, 0.5, 1, 2].forEach((columnSizeRatio) => {
    add(`test columnSize: ${columnSize}, columnSizeRatio: ${columnSizeRatio}`, async ({ seeJSONDiffWithScreenshot, updateArgs }) => {
      await updateArgs({ columnSize, columnSizeRatio });
      seeJSONDiffWithScreenshot(`masonrygrid-100-column-columnSize-${columnSize}-columnSizeRatio-${columnSizeRatio}.json`);
    });
  });
});

execute();
