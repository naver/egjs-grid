import { GridFunction } from "../../../src/types";

type CFCScenarioCallback = (e: {
  I: CodeceptJS.I,
  updateArgs: (args: any) => any,
  seeJSONDiffWithScreenshot: (path: string, selector?: string) => void,
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
              updateArgs: (args) => updateArgs(I, storyId, {...defaultOptions, ...args}),
              seeJSONDiffWithScreenshot: seeJSONDiffWithScreenshot(I, framework),
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
export function wait(delay: number) {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, delay);
  });
}
export async function updateArgs(I: CodeceptJS.I, storyId: string, args: any) {
  await I.updateArgs(storyId, args);
  await wait(60);
}
export function seeJSONDiffWithScreenshot(I: CodeceptJS.I, framework: string) {
  return async (path: string, selector = ".container") => {
    if (framework === "vanilla") {
      await I.saveElementJSON(selector, path);
      return;
    }
    await I.seeJSONDiffForElement(selector, path,);
  };
}
