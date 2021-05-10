import { MasonryGrid } from "../../../src/";
import { CFCScenario } from "./utils";

Feature('Test MasonryGrid(Default)');

const storyId = "examples-masonrygrid--masonry-grid-template";

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
  await seeJSONDiffWithScreenshot("masonrygrid-default.json");
});

["start", "center", "end", "justify", "stretch"].forEach((align) => {
  add(`test algin: "${align}"`, async ({ seeJSONDiffWithScreenshot, updateArgs }) => {
    await updateArgs({ align });
    await seeJSONDiffWithScreenshot(`masonrygrid-align-${align}.json`);
  });

  [1, 2, 3].forEach((column) => {
    add(`test algin: "${align}", column: ${column}`, async ({ seeJSONDiffWithScreenshot, updateArgs }) => {
      await updateArgs({ align, column });
      await seeJSONDiffWithScreenshot(`masonrygrid-align-${align}-column-${column}.json`);
    });
  });
});
[0, 100].forEach((columnSize) => {
  add(`test columnSize: ${columnSize}`, async ({ seeJSONDiffWithScreenshot, updateArgs }) => {
    await updateArgs({ columnSize });
    await seeJSONDiffWithScreenshot(`masonrygrid-columnSize-${columnSize}.json`);
  });
  [0, 0.5, 1, 2].forEach((columnSizeRatio) => {
    add(`test columnSize: ${columnSize}, columnSizeRatio: ${columnSizeRatio}`, async ({ seeJSONDiffWithScreenshot, updateArgs }) => {
      await updateArgs({ columnSize, columnSizeRatio });
      await seeJSONDiffWithScreenshot(`masonrygrid-columnSize-${columnSize}-columnSizeRatio-${columnSizeRatio}.json`);
    });
  });
});

execute();
