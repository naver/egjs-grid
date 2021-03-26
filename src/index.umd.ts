/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
import Grid, * as modules from "./index";

for (const name in modules) {
  (Grid as any)[name] = (modules as any)[name];
}
export default Grid;
