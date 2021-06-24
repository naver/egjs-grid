import { GridEvents } from "@egjs/grid";
import { REACT_GRID_EVENT_MAP } from "./consts";


export type Entries<
  Obj extends { [key: string]: any },
  Key = keyof Obj
> = Key extends string ? [Key, Obj[Key]] : never;

export type EventEntries = Entries<typeof REACT_GRID_EVENT_MAP>;
export type ReactEvents = EventEntries[1];

export type FindEventName<
  Value extends string,
  E = EventEntries,
> = E extends [infer Name, Value] ? Name : never;

export type ReactGridEvents = {
  [ReactEventName in ReactEvents]?: (e: GridEvents[FindEventName<ReactEventName>]) => any;
};
export interface ReactGridProps extends ReactGridEvents {
  tag?: string;
}
