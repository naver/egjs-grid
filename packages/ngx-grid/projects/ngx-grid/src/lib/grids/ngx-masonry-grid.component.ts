import {
  Component, Input,
} from '@angular/core';
import { GridFunction, MasonryGrid, MasonryGridOptions } from '@egjs/grid';
import { NgxGridComponent } from '../ngx-grid.component';

@Component({
  selector: 'ngx-masonry-grid, [NgxMasonryGrid]',
  template: '<ng-content></ng-content>',
  styles: [
    ':host { display: block }',
  ],
})
export class NgxMasonryGridComponent
  extends NgxGridComponent
  implements Required<MasonryGridOptions> {


  public static GridClass: GridFunction = MasonryGrid;

  @Input() column!: Required<MasonryGrid>['column'];
  @Input() columnSize!: Required<MasonryGrid>['columnSize'];
  @Input() columnSizeRatio!: Required<MasonryGrid>['columnSizeRatio'];
  @Input() align!: Required<MasonryGrid>['align'];
  @Input() columnCalculationThreshold!: Required<MasonryGrid>['columnCalculationThreshold'];
  @Input() maxStretchColumnSize!: Required<MasonryGrid>['maxStretchColumnSize'];
  @Input() contentAlign!: Required<MasonryGrid>['contentAlign'];
  @Input() stretchOutline!: Required<MasonryGrid>['stretchOutline'];
  @Input() stretchContainerSize!: Required<MasonryGrid>['stretchContainerSize'];
  @Input() stretchItemSize!: Required<MasonryGrid>['stretchItemSize'];
}
