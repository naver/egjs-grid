import{
  GridMethods,
  withGridMethods,
} from "../../../src/index";
import { SampleGrid } from "./SampleGrid";

export class SampleGridFramework {
  @withGridMethods
  private _grid!: SampleGrid;

  constructor(container: HTMLElement) {
    this._grid = new SampleGrid(container);
  }
}

export interface SampleGridFramework extends GridMethods<SampleGridFramework> { }
