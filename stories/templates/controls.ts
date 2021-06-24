import { makeArgType, makeLink } from "../utils";

export const DEFAULT_CONTROLS = {
  defaultDirection: makeArgType({
    type: "inline-radio",
    description: makeLink("Grid", "defaultDirection"),
    control: {
      options: ["start", "end"],
    },
    defaultValue: "end",
  }),
  gap: makeArgType({
    type: "number",
    description: makeLink("Grid", "gap"),
    defaultValue: 5,
  }),
};

export const MASONRY_GRID_CONTROLS = {
  ...DEFAULT_CONTROLS,
  align: makeArgType({
    type: "inline-radio",
    control: {
      options: ["start", "center", "end", "justify", "stretch"],
    },
    defaultValue: "justify",
    description: makeLink("MasonryGrid", "align"),
  }),
  column: makeArgType({
    type: "number",
    description: makeLink("MasonryGrid", "column"),
    defaultValue: 0,
  }),
  columnSize: makeArgType({
    type: "number",
    description: makeLink("MasonryGrid", "columnSize"),
    defaultValue: 0,
  }),
  columnSizeRatio: makeArgType({
    type: "number",
    description: makeLink("MasonryGrid", "columnSizeRatio"),
    defaultValue: 0,
  }),
};


export const JUSTIFIED_GRID_CONTROLS = {
  ...DEFAULT_CONTROLS,
  columnRange: makeArgType({
    type: "object",
    description: makeLink("JustifiedGrid", "columnRange"),
    defaultValue: [1, 8],
  }),
  rowRange: makeArgType({
    type: "object",
    description: makeLink("JustifiedGrid", "rowRange"),
    defaultValue: 0,
  }),
  sizeRange: makeArgType({
    type: "object",
    description: makeLink("JustifiedGrid", "sizeRange"),
    defaultValue: [200, 1000],
  }),
  isCroppedSize: makeArgType({
    type: "boolean",
    description: makeLink("JustifiedGrid", "isCroppedSize"),
    defaultValue: false,
  }),
  displayedRow: makeArgType({
    type: "number",
    description: makeLink("JustifiedGrid", "displayedRow"),
    defaultValue: -1,
  }),
};

export const FRAME_GRID_CONTROLS = {
  ...DEFAULT_CONTROLS,
  frame: makeArgType({
    type: "object",
    description: makeLink("FrameGrid", "frame"),
    defaultValue: [
      [1, 1, 2, 2],
      [3, 3, 2, 2],
      [4, 4, 4, 5],
    ],
  }),
  rectSize: makeArgType({
    type: "object",
    description: makeLink("FrameGrid", "rectSize"),
    defaultValue: 0,
  }),
  useFrameFill: makeArgType({
    type: "boolean",
    description: makeLink("FrameGrid", "useFrameFill"),
    defaultValue: true,
  }),
};

export const PACKING_GRID_CONTROLS = {
  ...DEFAULT_CONTROLS,
  sizeWeight: makeArgType({
    type: "number",
    description: makeLink("PackingGrid", "sizeWeight"),
    defaultValue: 1,
  }),
  ratioWeight: makeArgType({
    type: "number",
    description: makeLink("PackingGrid", "sizeWeight"),
    defaultValue: 1,
  }),
  aspectRatio: makeArgType({
    type: "number",
    description: makeLink("PackingGrid", "aspectRatio"),
    defaultValue: 1,
  }),
  weightPriority: makeArgType({
    type: "inline-radio",
    description: makeLink("PackingGrid", "weightPriority"),
    defaultValue: "custom",
    control: {
      options: ["ratio", "size", "custom"],
    },
  }),
};



export const CROPPED_JUSTIFIED_GRID_CONTROLS = {
  ...JUSTIFIED_GRID_CONTROLS,
  rowRange: makeArgType({
    type: "object",
    description: makeLink("JustifiedGrid", "rowRange"),
    defaultValue: 3,
  }),
  sizeRange: makeArgType({
    type: "object",
    description: makeLink("JustifiedGrid", "sizeRange"),
    defaultValue: [290, 310],
  }),
  isCroppedSize: makeArgType({
    type: "boolean",
    description: makeLink("JustifiedGrid", "isCroppedSize"),
    defaultValue: true,
  }),
};
