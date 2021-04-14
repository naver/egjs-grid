import { PackingGrid } from "../../src/grids/PackingGrid";
import {
  appendElements,
  chaseItem,
  cleanup, getCost, sandbox, waitEvent,
} from "./utils/utils";


describe("test PackingGrid", () => {
  let grid: PackingGrid | null;
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
    grid = new PackingGrid(container!, {
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
  it(`should check that all items are connected`, async () => {
    // Given
    container!.style.cssText = "width: 600px;";
    grid = new PackingGrid(container!, {
      gap: 5,
    });

    appendElements(container!, 4);
    // When

    grid.renderItems();

    await waitEvent(grid, "renderComplete");


    const items = grid.getItems();
    const checks = chaseItem(items, items[0], 5);

    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [0],
      end: [605],
    });

    const maxInlinePos = Math.max(...items.map((item) => item.cssInlinePos + item.cssInlineSize));
    const maxContentPos = Math.max(...items.map((item) => item.cssContentPos + item.cssContentSize));

    expect(checks.every((chk) => chk)).to.be.true;
    expect(maxInlinePos).to.be.closeTo(600, 0.000001);
    expect(maxContentPos).to.be.closeTo(600, 0.000001);
    expect(container!.style.height).to.be.equals("600px");
  });
  it(`should check if inlineSize:ContentSize is 1:2`, async () => {
    // Given
    container!.style.cssText = "width: 600px;";
    grid = new PackingGrid(container!, {
      aspectRatio: 0.5,
      gap: 5,
    });

    appendElements(container!, 4);
    // When

    grid.renderItems();

    await waitEvent(grid, "renderComplete");


    const items = grid.getItems();
    const checks = chaseItem(items, items[0], 5);

    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [0],
      end: [1205],
    });

    const maxInlinePos = Math.max(...items.map((item) => item.cssInlinePos + item.cssInlineSize));
    const maxContentPos = Math.max(...items.map((item) => item.cssContentPos + item.cssContentSize));

    expect(checks.every((chk) => chk)).to.be.true;
    expect(maxInlinePos).to.be.closeTo(600, 0.000001);
    expect(maxContentPos).to.be.closeTo(1200, 0.000001);
    expect(container!.style.height).to.be.equals("1200px");
  });
  it(`should check if inlineSize:ContentSize is 2:1`, async () => {
    // Given
    container!.style.cssText = "width: 600px;";
    grid = new PackingGrid(container!, {
      aspectRatio: 2,
      gap: 5,
    });

    appendElements(container!, 4);
    // When

    grid.renderItems();

    await waitEvent(grid, "renderComplete");


    const items = grid.getItems();
    const checks = chaseItem(items, items[0], 5);

    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [0],
      end: [305],
    });

    const maxInlinePos = Math.max(...items.map((item) => item.cssInlinePos + item.cssInlineSize));
    const maxContentPos = Math.max(...items.map((item) => item.cssContentPos + item.cssContentSize));

    expect(checks.every((chk) => chk)).to.be.true;
    expect(maxInlinePos).to.be.closeTo(600, 0.000001);
    expect(maxContentPos).to.be.closeTo(300, 0.000001);
    expect(container!.style.height).to.be.equals("300px");
  });
  it(`should check if ratio distortion with weightPriority "ratio" is less than ratio distortion with weightPriority "size"`, async () => {
    // Given
    container!.style.cssText = "width: 600px;";
    grid = new PackingGrid(container!, {
      aspectRatio: 1,
      gap: 0,
      weightPriority: "size",
      sizeWeight: 1,
      ratioWeight: 1,
    });

    appendElements(container!, 10);

    // When
    // "size"
    grid.renderItems();
    await waitEvent(grid, "renderComplete");

    const items = grid.getItems();
    const distortion1 = items.reduce((prev, item) => {
      const ratioCost = getCost(item.orgInlineSize / item.orgContentSize, item.cssInlineSize / item.cssContentSize);

      return prev + ratioCost;
    }, 0);


    // "ratio"
    grid.weightPriority = "ratio";
    await waitEvent(grid, "renderComplete");

    const distortion2 = items.reduce((prev, item) => {
      const ratioCost = getCost(item.orgInlineSize / item.orgContentSize, item.cssInlineSize / item.cssContentSize);

      return prev + ratioCost;
    }, 0);

    // Then
    expect(distortion2).to.be.below(distortion1);
  });
});
