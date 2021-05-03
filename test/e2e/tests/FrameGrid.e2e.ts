import { FrameGrid } from "../../../src/";
import { CFCScenario } from "./utils";

Feature('Test FrameGrid');

const storyId = "examples-framegrid--frame-grid-template";

const {
  add,
  execute,
} = CFCScenario<typeof FrameGrid>(storyId, {
  gap: 5,
  frame: [[1,1,2,2],[3,3,2,2],[4,4,4,5]],
  rectSize: 0,
  useFrameFill: true,
});

add("FrameGrid Initialization", async ({ seeVisualDiffWithScreenshot }) => {
  seeVisualDiffWithScreenshot("framegrid-default.png");
});
[0, 100, { inlineSize: 100, contentSize: 50}].forEach((rectSize) => {
  add(`test rectSize: ${rectSize}`, async ({ seeVisualDiffWithScreenshot, updateArgs }) => {
    await updateArgs({ rectSize });
    seeVisualDiffWithScreenshot(`framegrid-rectSize-${JSON.stringify(rectSize)}.png`);
  });
});
[true, false].forEach((useFrameFill) => {
  add(`test useFrameFill: ${useFrameFill}`, async ({ seeVisualDiffWithScreenshot, updateArgs }) => {
    await updateArgs({ frame: [
      [0, 1, 2, 3],
      [4, 0, 0, 0],
    ], useFrameFill });
    seeVisualDiffWithScreenshot(`framegrid-useFrameFill-${useFrameFill}.png`);
  });
});
execute();
