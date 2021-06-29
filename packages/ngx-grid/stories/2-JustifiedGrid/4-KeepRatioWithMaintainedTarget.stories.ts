import { AppComponent } from './apps/NgxKeepRatioWithMaintainedTargetApp/app.component';
import { JUSTIFIED_GRID_CONTROLS } from '../../../../stories/templates/controls';
import { convertPath, convertAngularTemplate, makeArgs } from '../../../../stories/utils';
import HTML_TEMPLATE from '!!raw-loader!./apps/NgxKeepRatioWithMaintainedTargetApp/app.component.html';
import CSS_TEMPLATE from '!!raw-loader!../../../../stories/templates/default.css';
import RawApp from '!!raw-loader!./apps/NgxKeepRatioWithMaintainedTargetApp/app.component.ts';
import MODULE_TEMPLATE from '!!raw-loader!../apps/default/app.module.ts';

export const KeepRatioWithMaintainedTargetTemplate = (props: any) => ({
  component: AppComponent,
  props: {
    ...props,
    key: JSON.stringify(props),
  },
});
KeepRatioWithMaintainedTargetTemplate.storyName = "Keep ratio with maintained target";


KeepRatioWithMaintainedTargetTemplate.argTypes = JUSTIFIED_GRID_CONTROLS;
KeepRatioWithMaintainedTargetTemplate.args = {
  ...makeArgs(KeepRatioWithMaintainedTargetTemplate.argTypes),
};

KeepRatioWithMaintainedTargetTemplate.parameters = {
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
