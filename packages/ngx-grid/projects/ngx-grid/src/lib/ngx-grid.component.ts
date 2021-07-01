/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import {
  AfterViewChecked, AfterViewInit, Component, ElementRef,
  EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges,
} from '@angular/core';
import { GridFunction, GridOptions, GRID_EVENTS, OnContentError, OnRenderComplete } from '@egjs/grid';
import { NgxGridInterface } from './ngx-grid.interface';
import { NgxGridEvents } from './types';

// @dynamic
@Component({
  selector: 'ngx-grid, [NgxGrid]',
  template: '<slot></slot>',
  styles: [
    ':host { display: block }',
  ],
})
export class NgxGridComponent
  extends NgxGridInterface
  implements Required<GridOptions>, NgxGridEvents, AfterViewInit, AfterViewChecked, OnChanges, OnDestroy {

  public static GridClass: GridFunction;

  @Input() horizontal!: Required<GridOptions>['horizontal'];
  @Input() percentage!: Required<GridOptions>['percentage'];
  @Input() isEqualSize!: Required<GridOptions>['isEqualSize'];
  @Input() isConstantSize!: Required<GridOptions>['isConstantSize'];
  @Input() gap!: Required<GridOptions>['gap'];
  @Input() attributePrefix!: Required<GridOptions>['attributePrefix'];
  @Input() resizeDebounce!: Required<GridOptions>['resizeDebounce'];
  @Input() maxResizeDebounce!: Required<GridOptions>['maxResizeDebounce'];
  @Input() autoResize!: Required<GridOptions>['autoResize'];
  @Input() useFit!: Required<GridOptions>['useFit'];
  @Input() useTransform!: Required<GridOptions>['useTransform'];
  @Input() renderOnPropertyChange!: Required<GridOptions>['renderOnPropertyChange'];
  @Input() preserveUIOnDestroy!: Required<GridOptions>['preserveUIOnDestroy'];
  @Input() defaultDirection!: Required<GridOptions>['defaultDirection'];
  @Input() externalItemRenderer!: Required<GridOptions>['externalItemRenderer'];
  @Input() externalContainerManager!: Required<GridOptions>['externalContainerManager'];
  @Output() renderComplete!: EventEmitter<OnRenderComplete>;
  @Output() contentError!: EventEmitter<OnContentError>;

  constructor(private _containerElementRef: ElementRef) {
    super();
    GRID_EVENTS.forEach((name) => {
      (this as any)[name] = new EventEmitter();
    });
  }
  ngAfterViewInit(): void {
    const GridClass = (this.constructor as typeof NgxGridComponent).GridClass;
    const defaultOptions = GridClass.defaultOptions;
    const options: Partial<GridOptions> = {};

    for (const name in defaultOptions) {
      if (name in this && typeof (this as any)[name] !== "undefined") {
        (options as any)[name] = (this as any)[name];
      }
    }

    this.vanillaGrid = new GridClass(this._containerElementRef.nativeElement!, options);
    this.vanillaGrid.syncElements();

    GRID_EVENTS.forEach((name) => {
      this.vanillaGrid.on(name, (e) => {
        this[name].emit(e as any);
      });
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    const grid = this.vanillaGrid;

    if (!grid) {
      return;
    }
    const GridClass = (this.constructor as typeof NgxGridComponent).GridClass;
    const propertyTypes = GridClass.propertyTypes;

    for (const name in changes) {
      if (name in propertyTypes) {
        const { currentValue } = changes[name];

        (grid as any)[name] = currentValue;
      }
    }
  }
  ngAfterViewChecked() {
    this.vanillaGrid.syncElements();
  }
  ngOnDestroy() {
    this.vanillaGrid.destroy();
  }
}
