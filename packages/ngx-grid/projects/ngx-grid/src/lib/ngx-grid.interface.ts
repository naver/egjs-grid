/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import { Directive } from '@angular/core';
import VanillaGrid, { GridMethods, withGridMethods } from '@egjs/grid';

import { NgxGridComponent } from './ngx-grid.component';

@Directive()
export class NgxGridInterface {
  @withGridMethods
  protected vanillaGrid!: VanillaGrid;
}

export interface NgxGridInterface extends GridMethods<NgxGridComponent> {}
