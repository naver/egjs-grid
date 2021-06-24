import { AppComponent } from './apps/NgxKeepRatioWithOffsetApp/app.component';
import { JUSTIFIED_GRID_CONTROLS } from '../../../../stories/templates/controls';
import { convertPath, convertAngularTemplate, makeArgs } from '../../../../stories/utils';
import HTML_TEMPLATE from '!!raw-loader!./apps/NgxKeepRatioWithOffsetApp/app.component.html';
import CSS_TEMPLATE from '!!raw-loader!../../../../stories/templates/default.css';
import RawApp from '!!raw-loader!./apps/NgxKeepRatioWithOffsetApp/app.component.ts';
import MODULE_TEMPLATE from '!!raw-loader!../apps/default/app.module.ts';

export const KeepRatioWithOffsetTemplate = (props: any) => ({
  component: AppComponent,
  props: {
    ...props,
    key: JSON.stringify(props),
  },
});
KeepRatioWithOffsetTemplate.storyName = "Kepp ratio with offset";


KeepRatioWithOffsetTemplate.argTypes = JUSTIFIED_GRID_CONTROLS;
KeepRatioWithOffsetTemplate.args = {
  ...makeArgs(KeepRatioWithOffsetTemplate.argTypes),
};

KeepRatioWithOffsetTemplate.parameters = {
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
      template: convertAngularTemplate(convertPath(RawApp, "projects", "@egjs/ngx-grid")),
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
