import { MasonryGrid } from "../../../src";
import { CFCScenario, wait } from "./utils";

Feature('Test Method & Events');

const storyId = "examples-use-methods-events--methods-events-template";

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

add("Method & Events Initialization", async ({ seeJSONDiffWithScreenshot }) => {
  seeJSONDiffWithScreenshot("methods-events-default.json", ".root");
});
add("Click Button & Resize Item 2", async ({ seeJSONDiffWithScreenshot, I }) => {
  I.click(".button");

  await wait(50);
  seeJSONDiffWithScreenshot("methods-events-click-button.json", ".root");
});

execute();
