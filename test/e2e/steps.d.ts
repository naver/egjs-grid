/// <reference types='codeceptjs' />


type StorybookHelper = typeof import("./helper/StorybookHelper")["default"]["prototype"];
type HTMLHelper = typeof import("./helper/HTMLHelper")["default"]["prototype"];

declare namespace CodeceptJS {
  interface SupportObject { I: I }
  interface Methods extends Playwright {}
  interface I extends WithTranslation<Methods>, StorybookHelper, HTMLHelper  {
  }
  namespace Translation {
    interface Actions {}
  }
}
