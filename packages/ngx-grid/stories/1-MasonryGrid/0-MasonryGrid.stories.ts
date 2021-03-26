import { CommonModule } from '@angular/common';
import { moduleMetadata } from '@storybook/angular';
import { NgxGridModule } from '../../projects/ngx-grid/src/public-api';

export default {
  title: "Examples/MasonryGrid",
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [NgxGridModule, CommonModule],
    }),
  ],
};
export * from "./1-MasonryGrid.stories";
export * from "./2-MasonryGridMultiple.stories";
export * from "./3-MasonryGrid100.stories";
