
import { JustifiedGrid } from "../../../src";
import { CFCScenario } from "./utils";

Feature('Test JustifiedGrid');

const storyId = "examples-justifiedgrid--justified-grid-template";

const {
  add,
  execute,
} = CFCScenario<typeof JustifiedGrid>(storyId, {
  gap: 5,
  columnRange: [1, 8],
  rowRange: 0,
  sizeRange: [0, 1000],
});

add("JustifiedGrid Initialization", async ({ seeJSONDiffWithScreenshot }) => {
  seeJSONDiffWithScreenshot("justifiedgrid-default.json");
});

[[4, 4], [1, 4], [3, 8]].forEach((columnRange) => {
  add(`test columnRange: ${columnRange}`, async ({ seeJSONDiffWithScreenshot, updateArgs }) => {
    await updateArgs({ columnRange });
    seeJSONDiffWithScreenshot(`justifiedgrid-columnRange-${columnRange.join("_")}.json`);
  });
});
([0, [1, 4], [4, 4]] as const).forEach((rowRange) => {
  add(`test rowRange: ${rowRange}`, async ({ seeJSONDiffWithScreenshot, updateArgs }) => {
    await updateArgs({ rowRange });
    seeJSONDiffWithScreenshot(`justifiedgrid-rowRange-${rowRange ? rowRange.join("_") : "none"}.json`);
  });
});
[[0, 1000], [600, 800], [700, 1000]].forEach((sizeRange) => {
  add(`test sizeRange: ${sizeRange}`, async ({ seeJSONDiffWithScreenshot, updateArgs }) => {
    await updateArgs({ sizeRange });
    seeJSONDiffWithScreenshot(`justifiedgrid-sizeRange-${sizeRange.join("_")}.json`);
  });
});

execute();
