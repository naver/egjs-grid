import { AppComponent } from './apps/NgxMasonryGrid100App/app.component';
import { MASONRY_GRID_CONTROLS } from '../../../../stories/templates/controls';
import { convertPath, convertAngularTemplate, makeArgs } from '../../../../stories/utils';
import HTML_TEMPLATE from '!!raw-loader!./apps/NgxMasonryGrid100App/app.component.html';
import CSS_TEMPLATE from '!!raw-loader!../../../../stories/templates/default.css';
import RawNgxMasonryGrid100App from '!!raw-loader!./apps/NgxMasonryGrid100App/app.component.ts';
import MODULE_TEMPLATE from '!!raw-loader!../apps/default/app.module.ts';

export const MasonryGrid100Template = (props: any) => ({
  component: AppComponent,
  props: {
    ...props,
    key: JSON.stringify(props),
  },
});

MasonryGrid100Template.storyName = "MasonryGrid with item that place 100% columns";
MasonryGrid100Template.argTypes = MASONRY_GRID_CONTROLS;
MasonryGrid100Template.args = {
  ...makeArgs(MasonryGrid100Template.argTypes),
};

MasonryGrid100Template.parameters = {
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
      template: convertAngularTemplate(convertPath(RawNgxMasonryGrid100App, "projects", "@egjs/ngx-grid")),
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
