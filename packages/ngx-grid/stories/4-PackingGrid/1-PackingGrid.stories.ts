import { AppComponent } from './apps/NgxPackingGridApp/app.component';
import { PACKING_GRID_CONTROLS } from '../../../../stories/templates/controls';
import { convertPath, convertAngularTemplate, makeArgs } from '../../../../stories/utils';
import HTML_TEMPLATE from '!!raw-loader!./apps/NgxPackingGridApp/app.component.html';
import CSS_TEMPLATE from '!!raw-loader!../../../../stories/templates/default.css';
import RawNgxPackingGridApp from '!!raw-loader!./apps/NgxPackingGridApp/app.component.ts';
import MODULE_TEMPLATE from '!!raw-loader!../apps/default/app.module.ts';

export const PackingGridTemplate = (props: any) => ({
  component: AppComponent,
  props: {
    ...props,
    key: JSON.stringify(props),
  },
});
PackingGridTemplate.storyName = "PackingGrid";


PackingGridTemplate.argTypes = PACKING_GRID_CONTROLS;
PackingGridTemplate.args = {
  ...makeArgs(PackingGridTemplate.argTypes),
};

PackingGridTemplate.parameters = {
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
      template: convertAngularTemplate(convertPath(RawNgxPackingGridApp, "projects", "@egjs/ngx-grid")),
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
