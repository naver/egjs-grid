/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import * as React from "react";
import VanillaGrid, { withGridMethods, GridOptions, GridMethods, GridFunction } from "@egjs/grid";
import { ReactGridEvents } from "./types";
import { REACT_GRID_EVENTS } from "./consts";

export abstract class Grid<T extends GridOptions>
  extends React.PureComponent<T & ReactGridEvents & { [key: string]: any }> {
  public static GridClass: GridFunction;
  @withGridMethods
  private _grid!: VanillaGrid;
  private _containerRef = React.createRef<HTMLDivElement>();
  public render() {
    const attributes: { [key: string]: any } = {};
    const props = this.props;
    const GridClass = (this.constructor as typeof Grid).GridClass;
    const defaultOptions = GridClass.defaultOptions;

    for (const name in props) {
      if (name in defaultOptions || name in REACT_GRID_EVENTS) {
        continue;
      }
      attributes[name] = props[name];
    }
    return <div ref={this._containerRef} {...attributes}>
      {this.props.children}
    </div>;
  }
  public componentDidMount() {
    const GridClass = (this.constructor as typeof Grid).GridClass;
    const defaultOptions = GridClass.defaultOptions;
    const options: Partial<GridOptions> = {};
    const props = this.props;

    for (const name in defaultOptions) {
      if (name in props) {
        (options as any)[name] = (props as any)[name];
      }
    }

    this._grid = new GridClass(this._containerRef.current!, options);
    this._grid.syncElements();
  }
  public componentDidUpdate() {
    const GridClass = (this.constructor as typeof Grid).GridClass;
    const propertyTypes = GridClass.propertyTypes;
    const props = this.props;
    const grid = this._grid;

    for (const name in propertyTypes) {
      if (name in props) {
        (grid as any)[name] = (props as any)[name];
      }
    }
    this._grid.syncElements();
  }
  public componentWillUnmount() {
    this._grid.destroy();
  }
}
export interface Grid<T extends GridOptions> extends GridMethods<Grid<T>> { }
