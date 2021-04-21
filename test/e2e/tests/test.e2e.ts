
Feature('Test MasonryGrid');

const storyId = "examples-masonrygrid--masonry-grid-template";

Scenario("Initialization", async ({ I }) => {
  I.amOnPage(`http://localhost:6007/iframe.html?id=${storyId}&viewMode=story`);
  I.saveElementScreenshot(".container", "masonrygrid-default.png");
  I.seeVisualDiff("masonrygrid-default.png", { tolerance: 2, prepareBaseImage: false });
});

["start", "center", "end", "justify", "stretch"].forEach((align) => {
  Scenario(`test algin: "${align}"`, async ({ I }) => {
    I.amOnPage(`http://localhost:6007/iframe.html?id=${storyId}&viewMode=story`);
    await I.updateArgs(storyId, { align });
    I.saveElementScreenshot(".container", `masonrygrid-align-${align}.png`);
    I.seeVisualDiff(`masonrygrid-align-${align}.png`, { tolerance: 2, prepareBaseImage: false });
  });

  [1, 2, 3, 4].forEach((column) => {
    Scenario(`test algin: "${align}", column: ${column}`, async ({ I }) => {
      I.amOnPage(`http://localhost:6007/iframe.html?id=${storyId}&viewMode=story`);
      await I.updateArgs(storyId, { align, column });
      I.saveElementScreenshot(".container", `masonrygrid-align-${align}-column-${column}.png`);
      // I.seeVisualDiff(`masonrygrid-column-${column}.png`, { tolerance: 2, prepareBaseImage: false });
    });
  });
});

