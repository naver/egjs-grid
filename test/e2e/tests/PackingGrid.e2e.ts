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

add("PackingGrid Initialization", async ({ seeJSONDiffWithScreenshot }) => {
  seeJSONDiffWithScreenshot("packinggrid-default.json");
});

["ratio", "size", "custom"].forEach((weightPriority) => {
  [0.5, 1, 1.5].forEach((aspectRatio) => {
    add(`test weightPriority: ${weightPriority}, aspectRatio: ${aspectRatio}`, async ({ seeJSONDiffWithScreenshot, updateArgs }) => {
      await updateArgs({ weightPriority, aspectRatio });
      seeJSONDiffWithScreenshot(`packinggrid-weightPriority-${weightPriority}-aspectRatio-${aspectRatio}.json`);
    });
  });
});
execute();
