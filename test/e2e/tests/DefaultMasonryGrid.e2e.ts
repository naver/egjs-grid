import { CFCScenario } from "./utils";

Feature('Test MasonryGrid(Default)');

const storyId = "examples-masonrygrid--masonry-grid-template";



CFCScenario("Initialization", storyId, async ({ seeVisualDiffWithScreenshot }) => {

  seeVisualDiffWithScreenshot("masonrygrid-default.png");
});

["start", "center", "end", "justify", "stretch"].forEach((align) => {
  CFCScenario(`test algin: "${align}"`, storyId, async ({ I, seeVisualDiffWithScreenshot }) => {
    await I.updateArgs(storyId, { align });
    seeVisualDiffWithScreenshot(`masonrygrid-align-${align}.png`);
  });

  [1, 2, 3].forEach((column) => {
    CFCScenario(`test algin: "${align}", column: ${column}`, storyId, async ({ I, seeVisualDiffWithScreenshot }) => {
      await I.updateArgs(storyId, { align, column });
      seeVisualDiffWithScreenshot(`masonrygrid-align-${align}-column-${column}.png`);
    });
  });
});
[0, 100].forEach((columnSize) => {
  CFCScenario(`test columnSize: ${columnSize}`, storyId, async ({ I, seeVisualDiffWithScreenshot }) => {
    await I.updateArgs(storyId, { columnSize });
    seeVisualDiffWithScreenshot(`masonrygrid-columnSize-${columnSize}.png`);
  });
  [0, 0.5, 1, 2].forEach((columnSizeRatio) => {
    CFCScenario(`test columnSize: ${columnSize}, columnSizeRatio: ${columnSizeRatio}`,  storyId, async ({ I, seeVisualDiffWithScreenshot }) => {
      await I.updateArgs(storyId, { columnSize, columnSizeRatio });
      seeVisualDiffWithScreenshot(`masonrygrid-columnSize-${columnSize}-columnSizeRatio-${columnSizeRatio}.png`);
    });
  });
});
