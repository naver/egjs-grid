/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  PLATFORM_ID,
  Inject,
  NgZone,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GridFunction, GridOptions, GRID_EVENTS, OnContentError, OnRenderComplete } from '@egjs/grid';

import { NgxGridInterface } from './ngx-grid.interface';
import { NgxGridEvents } from './types';

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
  @Input() outlineLength!: Required<GridOptions>['outlineLength'];
  @Input() outlineSize!: Required<GridOptions>['outlineSize'];
  @Input() useRoundedSize!: Required<GridOptions>['useRoundedSize'];
  @Input() useResizeObserver!: Required<GridOptions>['useResizeObserver'];
  @Input() observeChildren!: Required<GridOptions>['observeChildren'];

  @Output() renderComplete!: EventEmitter<OnRenderComplete>;
  @Output() contentError!: EventEmitter<OnContentError>;

  private _destroy$ = new Subject<void>();

  constructor(
    private _ngZone: NgZone,
    private _host: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private _platformId: string
  ) {
    super();
    GRID_EVENTS.forEach((name) => {
      (this as any)[name] = new EventEmitter();
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformServer(this._platformId)) {
      return;
    }

    const GridClass = this._getGridClass();
    const defaultOptions = GridClass.defaultOptions;
    const options: Partial<GridOptions> = {};

    for (const name in defaultOptions) {
      if (name in this && typeof (this as any)[name] !== "undefined") {
        (options as any)[name] = (this as any)[name];
      }
    }

    this.vanillaGrid = this._ngZone.runOutsideAngular(() => {
      const vanillaGrid = new GridClass(this._host.nativeElement, options);
      vanillaGrid.syncElements();
      return vanillaGrid;
    });

    GRID_EVENTS.forEach((name) => {
      fromEvent(this.vanillaGrid, name)
        .pipe(takeUntil(this._destroy$))
        .subscribe((event) => {
          const emitter = this[name] as any;
          // `observed` is available on newer RxJS versions (7.2+).
          if (emitter.observed || emitter.observers.length > 0) {
            this._ngZone.run(() => emitter.emit(event as any));
          }
        });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const grid = this.vanillaGrid;

    if (!grid) {
      return;
    }

    const GridClass = this._getGridClass();
    const propertyTypes = GridClass.propertyTypes;

    for (const name in changes) {
      if (name in propertyTypes) {
        const { currentValue } = changes[name];

        (grid as any)[name] = currentValue;
      }
    }
  }

  ngAfterViewChecked() {
    this._ngZone.runOutsideAngular(() => this.vanillaGrid?.syncElements());
  }

  ngOnDestroy() {
    this._destroy$.next();
    this.vanillaGrid?.destroy();
  }

  private _getGridClass(): GridFunction {
    // We don't declare the type on the component class as `static GridClass: GridFunction`,
    // because it fails metadata collection when compiling.
    const GridClass = ((this.constructor as unknown) as {
      GridClass: GridFunction;
    }).GridClass;

    return GridClass;
  }
}
