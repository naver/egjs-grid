import {
  Component, Input,
} from '@angular/core';
import { GridFunction, FrameGrid, FrameGridOptions } from '@egjs/grid';
import { NgxGridComponent } from '../ngx-grid.component';

@Component({
  selector: 'ngx-frame-grid, [NgxFrameGrid]',
  template: '<ng-content></ng-content>',
  styles: [
    ':host { display: block }',
  ],
})
export class NgxFrameGridComponent
  extends NgxGridComponent
  implements Required<FrameGridOptions> {
  public static GridClass: GridFunction = FrameGrid;

  @Input() frame!: Required<FrameGrid>['frame'];
  @Input() rectSize!: Required<FrameGrid>['rectSize'];
  @Input() useFrameFill!: Required<FrameGrid>['useFrameFill'];
}
