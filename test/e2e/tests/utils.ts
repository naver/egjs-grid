import { GridFunction } from "../../../src/types";

type CFCScenarioCallback = (e: {
  I: CodeceptJS.I,
  updateArgs: (args: any) => any,
  seeVisualDiffWithScreenshot: (path: string, skipDiff?: boolean) => void,
}) => any;

const FRAMEWORK_NAMES = ["vanilla", "react", "angular", "vue", "svelte", "vue3"];

export function CFCScenario<T extends GridFunction>(storyId: string, defaultOptions: Partial<T["defaultOptions"]>) {
  const frameworkInfos: Record<string, any[]> = {};

  FRAMEWORK_NAMES.forEach((framework) => {
    frameworkInfos[framework] = [];
  });

  return {
    add(title: string, callback: CFCScenarioCallback) {
      FRAMEWORK_NAMES.forEach((framework) => {
        frameworkInfos[framework].push(() => {
          Scenario(`${framework} - ${title}`, async ({ I }) => {
            return callback({
              I,
              updateArgs: (args) => I.updateArgs(storyId, {...defaultOptions, ...args}),
              seeVisualDiffWithScreenshot: seeVisualDiffWithScreenshot(I, framework),
            });
          });
        });
      });
    },
    execute() {
      FRAMEWORK_NAMES.forEach((framework, i) => {
        const scenarios = frameworkInfos[framework];

        Scenario(`${framework} - load`, async ({ I }) => {
          I.amOnPage(`http://localhost:${6006 + i}/iframe.html?id=${storyId}`);
        });

        scenarios.forEach((callback) => {
          callback();
        });
      });
    },
  };
}
export function seeVisualDiffWithScreenshot(I: CodeceptJS.I, framework: string) {
  return (path: string) => {
    I.saveElementScreenshot(".container", path);

    if (framework === "vanilla") {
      return;
    }
    I.seeVisualDiffForElement(".container", path, { tolerance: 2, prepareBaseImage: false });
  };
}
