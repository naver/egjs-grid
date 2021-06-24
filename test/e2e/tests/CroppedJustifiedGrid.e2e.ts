
import { JustifiedGrid } from "../../../src";
import { CFCScenario } from "./utils";

Feature('Test Cropped JustifiedGrid');

const storyId = "examples-justifiedgrid--cropped-justified-grid-template";

const {
  add,
  execute,
} = CFCScenario<typeof JustifiedGrid>(storyId, {
  gap: 5,
  columnRange: [1, 8],
  isCroppedSize: true,
  sizeRange: [400, 400],
  rowRange: [4, 4],
});

add("Cropped JustifiedGrid Initialization", async ({ seeJSONDiffWithScreenshot }) => {
  seeJSONDiffWithScreenshot("cropped-justifiedgrid-default.json");
});
add("test displayedRow", async ({ seeJSONDiffWithScreenshot, updateArgs }) => {
  await updateArgs({ displayedRow: 2 });
  seeJSONDiffWithScreenshot("cropped-justifiedgrid-diaplayedRow-2.json");
});

execute();
