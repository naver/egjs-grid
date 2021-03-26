/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import { EventEmitter } from "@angular/core";
import { GridEvents } from "@egjs/grid";

export type NgxGridEvents = {
  [key in keyof GridEvents]: EventEmitter<GridEvents[key]>
};
