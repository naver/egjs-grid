import { AppComponent } from './apps/NgxJustifiedGridApp/app.component';
import { JUSTIFIED_GRID_CONTROLS } from '../../../../stories/templates/controls';
import { convertPath, convertAngularTemplate, makeArgs } from '../../../../stories/utils';
import HTML_TEMPLATE from '!!raw-loader!./apps/NgxJustifiedGridApp/app.component.html';
import CSS_TEMPLATE from '!!raw-loader!../../../../stories/templates/default.css';
import RawNgxJustifiedGridApp from '!!raw-loader!./apps/NgxJustifiedGridApp/app.component.ts';
import MODULE_TEMPLATE from '!!raw-loader!../apps/default/app.module.ts';

export const JustifiedGridTemplate = (props: any) => ({
  component: AppComponent,
  props: {
    ...props,
    key: JSON.stringify(props),
  },
});
JustifiedGridTemplate.storyName = "JustifiedGrid";


JustifiedGridTemplate.argTypes = JUSTIFIED_GRID_CONTROLS;
JustifiedGridTemplate.args = {
  ...makeArgs(JustifiedGridTemplate.argTypes),
};

JustifiedGridTemplate.parameters = {
  preview: [
    {
      tab: "CSS",
      template: CSS_TEMPLATE,
      language: "css",
    },
    {
      tab: "Angular",
      template: HTML_TEMPLATE,
      language: "html",
      description: "app.component.html",
    },
    {
      tab: "Angular",
      template: convertAngularTemplate(convertPath(RawNgxJustifiedGridApp, "projects", "@egjs/ngx-grid")),
      language: "ts",
      description: "app.component.ts",
    },
    {
      tab: "Angular",
      template: convertPath(MODULE_TEMPLATE, "projects", "@egjs/ngx-grid"),
      language: "ts",
      description: "app.module.ts",
    },
  ],
};
