/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import { NgModule } from '@angular/core';
import { NgxMasonryGridComponent } from './grids/ngx-masonry-grid.component';
import { NgxJustifiedGridComponent } from './grids/ngx-justified-grid.component';
import { NgxFrameGridComponent } from './grids/ngx-frame-grid.component';
import { NgxPackingGridComponent } from './grids/ngx-packing-grid.component';

@NgModule({
  declarations: [
    NgxMasonryGridComponent,
    NgxJustifiedGridComponent,
    NgxFrameGridComponent,
    NgxPackingGridComponent,
  ],
  imports: [
  ],
  exports: [
    NgxMasonryGridComponent,
    NgxJustifiedGridComponent,
    NgxFrameGridComponent,
    NgxPackingGridComponent,
  ],
})
export class NgxGridModule { }
