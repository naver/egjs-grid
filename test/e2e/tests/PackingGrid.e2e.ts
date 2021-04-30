import { PackingGrid } from "../../../src";
import { CFCScenario } from "./utils";

Feature('Test PackingGrid');

const storyId = "examples-packinggrid--packing-grid-template";

const {
  add,
  execute,
} = CFCScenario<typeof PackingGrid>(storyId, {
  weightPriority: "custom",
});

add("PackingGrid Initialization", async ({ seeVisualDiffWithScreenshot }) => {
  seeVisualDiffWithScreenshot("packinggrid-default.png");
});

["ratio", "size", "custom"].forEach((weightPriority) => {
  [0.5, 1, 1.5].forEach((aspectRatio) => {
    add(`test weightPriority: ${weightPriority}, aspectRatio: ${aspectRatio}`, async ({ seeVisualDiffWithScreenshot, updateArgs }) => {
      await updateArgs({ weightPriority, aspectRatio });
      seeVisualDiffWithScreenshot(`packinggrid-weightPriority-${weightPriority}-aspectRatio-${aspectRatio}.png`);
    });
  });
});
execute();
