import { AppComponent } from './apps/NgxMasonryGridMultipleApp/app.component';
import { MASONRY_GRID_CONTROLS } from '../../../../stories/templates/controls';
import { convertPath, convertAngularTemplate, makeArgs } from '../../../../stories/utils';
import HTML_TEMPLATE from '!!raw-loader!./apps/NgxMasonryGridMultipleApp/app.component.html';
import CSS_TEMPLATE from '!!raw-loader!../../../../stories/templates/default.css';
import RawNgxMasonryGridApp from '!!raw-loader!./apps/NgxMasonryGridMultipleApp/app.component.ts';
import MODULE_TEMPLATE from '!!raw-loader!../apps/default/app.module.ts';

export const MasonryGridMultipleTemplate = (props: any) => ({
  component: AppComponent,
  props: {
    ...props,
    key: JSON.stringify(props),
  },
});
MasonryGridMultipleTemplate.storyName = "MasonryGrid with item that place multiple columns";


MasonryGridMultipleTemplate.argTypes = MASONRY_GRID_CONTROLS;
MasonryGridMultipleTemplate.args = {
  ...makeArgs(MasonryGridMultipleTemplate.argTypes),
};

MasonryGridMultipleTemplate.parameters = {
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
      template: convertAngularTemplate(convertPath(RawNgxMasonryGridApp, "projects", "@egjs/ngx-grid")),
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
