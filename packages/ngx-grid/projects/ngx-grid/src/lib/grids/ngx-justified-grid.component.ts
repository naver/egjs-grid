import {
  Component, Input,
} from '@angular/core';
import { GridFunction, JustifiedGrid, JustifiedGridOptions } from '@egjs/grid';
import { NgxGridComponent } from '../ngx-grid.component';

@Component({
  selector: 'ngx-justified-grid, [NgxJustifiedGrid]',
  template: '<ng-content></ng-content>',
  styles: [
    ':host { display: block }',
  ],
})
export class NgxJustifiedGridComponent
  extends NgxGridComponent
  implements Required<JustifiedGridOptions> {
  public static GridClass: GridFunction = JustifiedGrid;

  @Input() columnRange!: Required<JustifiedGrid>['columnRange'];
  @Input() rowRange!: Required<JustifiedGrid>['rowRange'];
  @Input() sizeRange!: Required<JustifiedGrid>['sizeRange'];
  @Input() isCroppedSize!: Required<JustifiedGrid>['isCroppedSize'];
  @Input() displayedRow!: Required<JustifiedGrid>['displayedRow'];
}
