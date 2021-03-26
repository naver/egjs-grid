import {
  Component, Input,
} from '@angular/core';
import { GridFunction, PackingGrid, PackingGridOptions } from '@egjs/grid';
import { NgxGridComponent } from '../ngx-grid.component';

@Component({
  selector: 'ngx-packing-grid, [NgxPackingGrid]',
  template: '<ng-content></ng-content>',
  styles: [
    ':host { display: block }',
  ],
})
export class NgxPackingGridComponent
  extends NgxGridComponent
  implements Required<PackingGridOptions> {
  public static GridClass: GridFunction = PackingGrid;

  @Input() sizeWeight!: Required<PackingGrid>['sizeWeight'];
  @Input() ratioWeight!: Required<PackingGrid>['ratioWeight'];
  @Input() aspectRatio!: Required<PackingGrid>['aspectRatio'];
}
