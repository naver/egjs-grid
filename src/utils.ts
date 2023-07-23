/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import Grid from "./Grid";
import { GRID_METHODS, GRID_PROPERTY_TYPES, PROPERTY_TYPE } from "./consts";
import { GridItem } from "./GridItem";
import { ResizeWatcherEntry } from "./ResizeWatcher";
import { diff } from "@egjs/children-differ";

export function getKeys<T extends Record<string, any>>(obj: T): Array<keyof T> {
  return Object.keys(obj);
}
export function getUpdatedItems(items: GridItem[], entries: ResizeWatcherEntry[]) {
  const mountedItems = getMountedItems(items);

  return diff(
    entries.map((entry) => entry.target),
    mountedItems.map((item) => item.element!),
  ).maintained.filter(([prevIndex, nextIndex]) => {
    const entrySize = entries[prevIndex].size!;
    const item = items[nextIndex];

    return !item.inlineSize || !item.contentSize
      || entrySize.inlineSize !== item.computedInlineSize
      || entrySize.blockSize !== item.computedContentSize;
  }).map(([, nextIndex]) => items[nextIndex]);
}
export function getMountedItems(items: GridItem[]) {
  return items.filter((item) => item.element);
}
export function getMountedElements(items: GridItem[]) {
  return getMountedItems(items).map((item) => item.element!);
}
export function isString(val: any): val is string {
  return typeof val === "string";
}
export function isObject(val: any): val is object {
  return typeof val === "object";
}
export function isNumber(val: any): val is number {
  return typeof val === "number";
}
export function camelize(str: string) {
  return str.replace(/[\s-_]([a-z])/g, (all, letter) => letter.toUpperCase());
}

export function getDataAttributes(element: HTMLElement, attributePrefix: string) {
  const dataAttributes: Record<string, string> = {};
  const attributes = element.attributes;
  const length = attributes.length;

  for (let i = 0; i < length; ++i) {
    const attribute = attributes[i];
    const { name, value } = attribute;
    if (name.indexOf(attributePrefix) === -1) {
      continue;
    }
    dataAttributes[camelize(name.replace(attributePrefix, ""))] = value;
  }

  return dataAttributes;
}

/* Class Decorator */
export function GetterSetter(component: {
  prototype: Grid<any>,
  propertyTypes: typeof GRID_PROPERTY_TYPES,
}) {
  const {
    prototype,
    propertyTypes,
  } = component;
  for (const name in propertyTypes) {
    const shouldRender = propertyTypes[name] === PROPERTY_TYPE.RENDER_PROPERTY;

    const descriptor = Object.getOwnPropertyDescriptor(prototype, name) || {};

    const getter = descriptor.get || function get(this: Grid) {
      return this.options[name];
    };
    const setter = descriptor.set || function set(this: Grid, value: any) {
      const options = this.options;
      const prevValue = options[name];

      if (prevValue === value) {
        return;
      }
      options[name] = value;

      if (shouldRender && options.renderOnPropertyChange) {
        this.scheduleRender();
      }
    };
    const attributes: Record<string, any> = {
      enumerable: true,
      configurable: true,
      get: getter,
      set: setter,
    };
    Object.defineProperty(prototype, name, attributes);
  }
}

export function withMethods(methods: readonly string[]) {
  return function (prototype: any, memberName: string) {
    methods.forEach((name: string) => {
      if (name in prototype) {
        return;
      }
      prototype[name] = function (...args) {
        const result = this[memberName][name](...args);

        // fix `this` type to return your own `class` instance to the instance using the decorator.
        if (result === this[memberName]) {
          return this;
        } else {
          return result;
        }
      };
    });
  };
}

export function range(length: number): number[] {
  const arr: number[] = [];
  for (let i = 0; i < length; ++i) {
    arr.push(i);
  }
  return arr;
}

export function getRangeCost(value: number, valueRange: number[]) {
  return Math.max(value - valueRange[1], valueRange[0] - value, 0) + 1;
}

/**
 * Decorator that makes the method of grid available in the framework.
 * @ko 프레임워크에서 그리드의 메소드를 사용할 수 있게 하는 데코레이터.
 * @memberof eg.Grid
 * @private
 * @example
 * ```js
 * import { withGridMethods } from "@egjs/grid";
 *
 * class Grid extends React.Component<Partial<GridProps & GridOptions>> {
 *   &#64;withGridMethods
 *   private grid: NativeGrid;
 * }
 * ```
 */
export const withGridMethods = withMethods(GRID_METHODS);
