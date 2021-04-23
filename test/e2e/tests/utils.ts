type CFCScenarioCallback = (e: {
  I: CodeceptJS.I,
  seeVisualDiffWithScreenshot: (path: string, skipDiff?: boolean) => void,
}) => any;

export function CFCScenario(title: string, storyId: string, callback?: CFCScenarioCallback) {

  if (!callback) {
    Scenario(title);
    return;
  }
  Scenario(`vanilla - ${title}`, async ({ I }) => {
    I.amOnPage(`http://localhost:6006/iframe.html?id=${storyId}`);
    return callback({
      I,
      seeVisualDiffWithScreenshot: seeVisualDiffWithScreenshot(I, ""),
    });
  });
  Scenario(`react - ${title}`, async ({ I }) => {
    I.amOnPage(`http://localhost:6007/iframe.html?id=${storyId}`);
    return callback({
      I,
      seeVisualDiffWithScreenshot: seeVisualDiffWithScreenshot(I, "react"),
    });
  });
  // Scenario(`vue - ${title}`, async ({ I }) => {
  //   I.amOnPage(`http://localhost:6008/iframe.html?id=${storyId}`);
  //   return callback({ I });
  // });
  // Scenario(`angular - ${title}`, async ({ I }) => {
  //   I.amOnPage(`http://localhost:6009/iframe.html?id=${storyId}`);
  //   return callback({ I });
  // });
  // Scenario(`svelte - ${title}`, async ({ I }) => {
  //   I.amOnPage(`http://localhost:6009/iframe.html?id=${storyId}`);
  //   return callback({ I });
  // });
}
export function seeVisualDiffWithScreenshot(I: CodeceptJS.I, framework: string) {
  return (path: string, skipDiff?: boolean) => {
    I.saveElementScreenshot(".container", path);

    if (skipDiff) {
      return;
    }
    if (framework) {
      // framework
      I.seeVisualDiffForElement(".container", path, { tolerance: 2, prepareBaseImage: false });
    } else {
      // vanilla
      I.seeVisualDiff(path, { tolerance: 2, prepareBaseImage: false });
    }
  };
}
