import { CommonModule } from '@angular/common';
import { moduleMetadata } from '@storybook/angular';
import { NgxGridModule } from '../../projects/ngx-grid/src/public-api';

export default {
  title: "Examples/PackingGrid",
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [NgxGridModule, CommonModule],
    }),
  ],
};
export * from "./1-PackingGrid.stories";
