/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import * as React from "react";
import VanillaGrid, { withGridMethods, GridOptions, GridMethods, GridFunction } from "@egjs/grid";
import { ReactGridProps } from "./types";
import { REACT_GRID_PROPS, REACT_GRID_EVENT_MAP } from "./consts";

export abstract class Grid<T extends GridOptions>
  extends React.PureComponent<T & ReactGridProps & { [key: string]: any }> {
  public static GridClass: GridFunction;
  @withGridMethods
  private _grid!: VanillaGrid;
  private _containerRef = React.createRef<HTMLDivElement>();
  public render() {
    const attributes: { [key: string]: any } = {};
    const props = this.props;
    const GridClass = (this.constructor as typeof Grid).GridClass;
    const defaultOptions = GridClass.defaultOptions;
    const Tag = props.tag as any || "div";

    for (const name in props) {
      if (name in defaultOptions || REACT_GRID_PROPS.indexOf(name as any) > -1) {
        continue;
      }
      attributes[name] = props[name];
    }
    return <Tag ref={this._containerRef} {...attributes}>
      {this.props.children}
    </Tag>;
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

    const grid = new GridClass(this._containerRef.current!, options);

    for (const eventName in REACT_GRID_EVENT_MAP) {
      const reactEventName = (REACT_GRID_EVENT_MAP as any)[eventName];

      grid.on(eventName as any, (e: any) => {
        const callback = props[reactEventName];

        callback && callback({...e});
      });
    }
    grid.syncElements();

    this._grid = grid;
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
