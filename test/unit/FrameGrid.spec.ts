import { FrameGrid } from "../../src/grids/FrameGrid";
import {
  appendElements,
  cleanup, sandbox, waitEvent,
} from "./utils/utils";


describe("test FrameGrid", () => {
  let grid: FrameGrid | null;
  let container: HTMLElement | null;

  beforeEach(() => {
    container = sandbox("");
    container!.style.cssText = "";
  });

  afterEach(() => {
    if (grid) {
      grid.destroy();
    }
    grid = null;
    container = null;
    cleanup();
  });
  it("should check if height is 0 when there are no items", async () => {
    // Given
    grid = new FrameGrid(container!, {
      gap: 5,
    });

    // When
    grid.renderItems();

    await waitEvent(grid, "renderComplete");

    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [],
      end: [],
    });
    expect(container!.style.height).to.be.equals("0px");
  });
  it("should check if the grid is rendered to fit the frame (items' length = frame rects' length)", async () => {
    // Given
    container!.style.cssText = "width: 1000px;";
    grid = new FrameGrid(container!, {
      gap: 10,
      frame: [
        [1, 1, 0, 0, 2],
        [1, 1, 0, 3, 3],
      ],
    });

    appendElements(container!, 3);

    // When
    grid.renderItems();

    await waitEvent(grid, "renderComplete");

    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [0, 0, 0, 202, 0],
      end: [404, 404, 0, 404, 404],
    });
    expect(grid.getItems().map((item) => item.cssRect)).to.be.deep.equals([
      // 2 * 2
      { left: 0, top: 0, width: 394, height: 394 },
      // 1 * 1
      { left: 808, top: 0, width: 192, height: 192 },
      // 2 * 1
      { left: 606, top: 202, width: 394, height: 192 },
    ]);
  });
  it("should check if the grid is rendered to fit the frame (item's length > frame rect's length)", async () => {
    // Given
    container!.style.cssText = "width: 1000px;";
    grid = new FrameGrid(container!, {
      gap: 10,
      frame: [
        [1, 1, 0, 0, 2],
        [1, 1, 0, 3, 3],
      ],
    });

    appendElements(container!, 4);

    // When
    grid.renderItems();

    await waitEvent(grid, "renderComplete");

    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [0, 0, 0, 202, 0],
      end: [808, 808, 0, 404, 404],
    });
    expect(grid.getItems().map((item) => item.cssRect)).to.be.deep.equals([
      // 2 * 2
      { left: 0, top: 0, width: 394, height: 394 },
      // 1 * 1
      { left: 808, top: 0, width: 192, height: 192 },
      // 2 * 1
      { left: 606, top: 202, width: 394, height: 192 },
      // 2 * 2
      { left: 0, top: 404, width: 394, height: 394 },
    ]);
  });
  it("should check if it is rendered while filling the teeth of the frame", async () => {
    // Given
    container!.style.cssText = "width: 1000px;";
    grid = new FrameGrid(container!, {
      gap: 10,
      frame: [
        [1, 0],
        [0, 2],
      ],
    });

    appendElements(container!, 4);

    // When
    grid.renderItems();

    await waitEvent(grid, "renderComplete");

    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [0, 505],
      end: [1010, 1515],
    });
    expect(grid.getItems().map((item) => item.cssRect)).to.be.deep.equals([
      { left: 0, top: 0, width: 495, height: 495 },
      { left: 505, top: 505, width: 495, height: 495 },
      { left: 0, top: 505, width: 495, height: 495 },
      { left: 505, top: 1010, width: 495, height: 495 },
    ]);
  });
  it("should check if it is rendered without filling the teeth of the frame", async () => {
    // Given
    container!.style.cssText = "width: 1000px;";
    grid = new FrameGrid(container!, {
      gap: 10,
      frame: [
        [1, 0],
        [0, 2],
      ],
      useFrameFill: false,
    });

    appendElements(container!, 4);

    // When
    grid.renderItems();

    await waitEvent(grid, "renderComplete");

    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [0, 505],
      end: [1515, 2020],
    });
    expect(grid.getItems().map((item) => item.cssRect)).to.be.deep.equals([
      { left: 0, top: 0, width: 495, height: 495 },
      { left: 505, top: 505, width: 495, height: 495 },
      { left: 0, top: 1010, width: 495, height: 495 },
      { left: 505, top: 1515, width: 495, height: 495 },
    ]);
  });
  it("should check if rendering is done properly according to the standard outline", async () => {
    // Given
    container!.style.cssText = "width: 1000px;";
    grid = new FrameGrid(container!, {
      gap: 10,
      frame: [
        [1, 0],
        [0, 2],
      ],
      useFit: false,
      useFrameFill: false,
    });

    appendElements(container!, 4);

    // When
    grid.renderItems({
      outline: [100, 100],
    });

    await waitEvent(grid, "renderComplete");

    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [100, 605],
      end: [1615, 2120],
    });
  });
});
