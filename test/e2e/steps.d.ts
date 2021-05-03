/// <reference types='codeceptjs' />
// type CFCHelper = typeof import("./helper/CFCHelper")["default"]["prototype"];

declare namespace CodeceptJS {
  interface SupportObject { I: I }
  interface Methods extends Playwright {}
  interface I extends WithTranslation<Methods> {
    setFramework(name: string);
    seeVisualDiff(path: string, options: Record<string, any>);
    seeVisualDiffWithScreenshot(path: string);
    seeVisualDiffForElement(selector: string, path: string, options: Record<string, any>);
    updateArgs(storyId: string, args: Record<string, any>): Promise<any>;
  }
  namespace Translation {
    interface Actions {}
  }
}
