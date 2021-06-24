
export const REACT_GRID_EVENT_MAP = {
  "contentError": "onContentError",
  "renderComplete": "onRenderComplete",
} as const;

export const REACT_GRID_EVENTS = [
  "onContentError",
  "onRenderComplete",
] as const;
export const REACT_GRID_PROPS = [
  "tag",
  ...REACT_GRID_EVENTS,
] as const;
