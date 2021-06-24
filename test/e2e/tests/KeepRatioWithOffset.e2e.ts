
import { JustifiedGrid } from "../../../src";
import { CFCScenario } from "./utils";

Feature('Test JustifiedGrid KeepRatioWithOffet');

const storyId = "examples-justifiedgrid--keep-ratio-with-offset-template";

const {
  add,
  execute,
} = CFCScenario<typeof JustifiedGrid>(storyId, {
  gap: 5,
  columnRange: [1, 8],
  sizeRange: [300, 400],
  rowRange: [4, 4],
});

add("JustifiedGrid KeepRatioWithOffet Initialization", async ({ seeJSONDiffWithScreenshot, I }) => {
  await I.waitImageLoaded();
  seeJSONDiffWithScreenshot("keep-ratio-with-offset-default.json");
});

execute();
