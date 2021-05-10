import { AppComponent } from './apps/NgxFrameGridApp/app.component';
import { FRAME_GRID_CONTROLS } from '../../../../stories/templates/controls';
import { convertPath, convertAngularTemplate, makeArgs } from '../../../../stories/utils';
import HTML_TEMPLATE from '!!raw-loader!./apps/NgxFrameGridApp/app.component.html';
import CSS_TEMPLATE from '!!raw-loader!../../../../stories/templates/default.css';
import RawNgxFrameGridApp from '!!raw-loader!./apps/NgxFrameGridApp/app.component.ts';
import MODULE_TEMPLATE from '!!raw-loader!../apps/default/app.module.ts';

export const FrameGridTemplate = (props: any) => ({
  component: AppComponent,
  props: {
    ...props,
    key: JSON.stringify(props),
  },
});
FrameGridTemplate.storyName = "FrameGrid";


FrameGridTemplate.argTypes = FRAME_GRID_CONTROLS;
FrameGridTemplate.args = {
  ...makeArgs(FrameGridTemplate.argTypes),
};

FrameGridTemplate.parameters = {
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
      template: convertAngularTemplate(convertPath(RawNgxFrameGridApp, "projects", "@egjs/ngx-grid")),
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
