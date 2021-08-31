import { GridItem } from "../../src";
import { MasonryGrid } from "../../src/grids/MasonryGrid";
import { cleanup, sandbox, waitEvent } from "./utils/utils";


describe("test MasonryGrid", () => {
  let grid: MasonryGrid | null;
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
    grid = new MasonryGrid(container!, {
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
  it(`should check whether the grid is applied according to the width of the item`, async () => {
    // Given
    container!.style.cssText = "width: 600px; height: 600px;";
    container!.innerHTML = `
      <div style="position: absolute;width: 250px; height: 250px;"></div>
      <div style="position: absolute;width: 300px; height: 300px;"></div>
      <div style="position: absolute;width: 500px; height: 500px;"></div>
      <div style="position: absolute;width: 250px; height: 250px;"></div>
    `;
    grid = new MasonryGrid(container!, {
      gap: 5,
    });

    // When
    grid.renderItems();

    await waitEvent(grid, "renderComplete");

    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [0, 0],
      end: [760, 560],
    });
    expect(grid.getItems().map((item) => item.cssRect)).to.be.deep.equals([
      { left: 0, top: 0 },
      { left: 350, top: 0 },
      { left: 0, top: 255 },
      { left: 350, top: 305 },
    ]);
    expect(container!.style.height).to.be.deep.equals("755px");
  });
  it(`should check if it is rendered in the opposite direction`, async () => {
    // Given
    container!.style.cssText = "width: 600px; height: 600px;";
    container!.innerHTML = `
      <div style="position: absolute;width: 250px; height: 250px;"></div>
      <div style="position: absolute;width: 300px; height: 300px;"></div>
      <div style="position: absolute;width: 500px; height: 500px;"></div>
      <div style="position: absolute;width: 250px; height: 250px;"></div>
    `;
    grid = new MasonryGrid(container!, {
      gap: 5,
    });

    // When
    grid.renderItems({
      direction: "start",
    });

    await waitEvent(grid, "renderComplete");

    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [0, 200],
      end: [760, 760],
    });
    expect(grid.getItems().map((item) => item.cssRect)).to.be.deep.equals([
      { left: 0, top: 0 },
      { left: 350, top: 200 },
      { left: 0, top: 255 },
      { left: 350, top: 505 },
    ]);
    expect(container!.style.height).to.be.deep.equals("755px");
  });
  it(`should check whether the column is 1 when items.length is 1`, async () => {
    // Given
    container!.style.cssText = "width: 600px; height: 600px;";
    container!.innerHTML = `
      <div style="position: absolute;width: 200px; height: 200px;"></div>
    `;
    grid = new MasonryGrid(container!, {
      gap: 5,
    });

    // When
    grid.renderItems();

    await waitEvent(grid, "renderComplete");

    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [0],
      end: [205],
    });
    expect(grid.getItems().map((item) => item.cssRect)).to.be.deep.equals([
      { left: 0, top: 0 },
    ]);
    expect(container!.style.height).to.be.deep.equals("200px");
  });
  it(`should check whether the column is 2 when items.length is 2`, async () => {
    // Given
    container!.style.cssText = "width: 600px; height: 600px;";
    container!.innerHTML = `
      <div style="position: absolute;width: 200px; height: 200px;"></div>
      <div style="position: absolute;width: 200px; height: 200px;"></div>
    `;
    grid = new MasonryGrid(container!, {
      gap: 5,
    });

    // When
    grid.renderItems();

    await waitEvent(grid, "renderComplete");

    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [0, 0],
      end: [205, 205],
    });
    expect(grid.getItems().map((item) => item.cssRect)).to.be.deep.equals([
      { left: 0, top: 0 },
      { left: 400, top: 0 },
    ]);
    expect(container!.style.height).to.be.deep.equals("200px");
  });
  it(`should check whether multiple columns are used when data-grid-column="0"`, async () => {
    // Given
    container!.style.cssText = "width: 600px; height: 600px;";
    container!.innerHTML = `
      <div style="position: absolute;width: 500px; height: 300px;" data-grid-column="0"></div>
      <div style="position: absolute;width: 200px; height: 200px;"></div>
      <div style="position: absolute;width: 500px; height: 500px;"></div>
      <div style="position: absolute;width: 250px; height: 250px;"></div>
    `;
    grid = new MasonryGrid(container!, {
      gap: 5,
    });

    // When
    grid.renderItems();

    await waitEvent(grid, "renderComplete");

    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [0, 0],
      end: [765, 810],
    });
    expect(grid.getItems().map((item) => item.cssRect)).to.be.deep.equals([
      { left: 0, top: 0 },
      { left: 0, top: 305 },
      { left: 400, top: 305 },
      { left: 0, top: 510 },
    ]);
    expect(container!.style.height).to.be.deep.equals("805px");
  });
  it(`should check whether multiple columns are used when data-grid-column="2"`, async () => {
    // Given
    container!.style.cssText = "width: 660px; height: 660px;";
    container!.innerHTML = `
      <div style="position: absolute;width: 500px; height: 300px;" data-grid-column="2"></div>
      <div style="position: absolute;width: 200px; height: 200px;" ></div>
      <div style="position: absolute;width: 500px; height: 500px;" data-grid-column="2"></div>
      <div style="position: absolute;width: 250px; height: 250px;"></div>
    `;
    grid = new MasonryGrid(container!, {
      gap: 10,
    });

    // When
    grid.renderItems();

    await waitEvent(grid, "renderComplete");

    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [0, 0, 0],
      end: [820, 820, 470],
    });
    expect(grid.getItems().map((item) => item.cssRect)).to.be.deep.equals([
      // column: 2
      { width: 430, left: 0, top: 0 },
      // column: 1
      { left: 460, top: 0 },
      // column: 2
      { width: 430, left: 0, top: 310 },
      // column: 1
      { left: 460, top: 210 },
    ]);
    expect(container!.style.height).to.be.deep.equals("810px");
  });
  it(`should check whether multiple columns are used when data-grid-max-column="3"`, async () => {
    // Given
    container!.style.cssText = "width: 660px; height: 660px;";
    container!.innerHTML = `
      <div style="position: absolute;width: 500px; height: 300px;" data-grid-column="2" data-grid-max-column="3"></div>
      <div style="position: absolute;width: 200px; height: 200px;" ></div>
      <div style="position: absolute;width: 500px; height: 500px;" data-grid-max-column="3"></div>
      <div style="position: absolute;width: 250px; height: 250px;"></div>
    `;
    grid = new MasonryGrid(container!, {
      gap: 10,
    });

    // When
    grid.renderItems();

    await waitEvent(grid, "renderComplete");

    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [0, 0, 0],
      end: [780, 820, 820],
    });
    expect(grid.getItems().map((item) => item.cssRect)).to.be.deep.equals([
      // column: 3
      { width: 660, left: 0, top: 0 },
      // column: 1
      { left: 0, top: 310 },
      // column: 2
      { width: 430, left: 230, top: 310 },
      // column: 1
      { left: 0, top: 520 },
    ]);
    expect(container!.style.height).to.be.deep.equals("810px");
  });
  it(`should check if there are 4 columns when column is 4`, async () => {
    // Given
    container!.style.cssText = "width: 600px; height: 600px;";
    container!.innerHTML = `
      <div style="position: absolute;width: 300px; height: 300px;"></div>
      <div style="position: absolute;width: 200px; height: 200px;"></div>
      <div style="position: absolute;width: 500px; height: 500px;"></div>
      <div style="position: absolute;width: 200px; height: 200px;"></div>
    `;
    grid = new MasonryGrid(container!, {
      gap: 5,
      column: 4,
    });

    // When
    grid.renderItems();

    await waitEvent(grid, "renderComplete");
    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [0, 0, 0, 0],
      end: [305, 205, 505, 205],
    });
    expect(grid.getItems().map((item) => item.cssRect)).to.be.deep.equals([
      { left: -307.5, top: 0 },
      { left: -2.5, top: 0 },
      { left: 302.5, top: 0 },
      { left: 607.5, top: 0 },
    ]);
    expect(container!.style.height).to.be.deep.equals("500px");
  });
  it(`should check if there are 4 columns when columnSize is 100`, async () => {
    // Given
    container!.style.cssText = "width: 600px; height: 600px;";
    container!.innerHTML = `
      <div style="position: absolute;width: 300px; height: 300px;"></div>
      <div style="position: absolute;width: 200px; height: 200px;"></div>
      <div style="position: absolute;width: 500px; height: 500px;"></div>
      <div style="position: absolute;width: 200px; height: 200px;"></div>
    `;
    grid = new MasonryGrid(container!, {
      gap: 10,
      columnSize: 120,
    });

    // When
    grid.renderItems();

    await waitEvent(grid, "renderComplete");

    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [0, 0, 0, 0],
      end: [310, 210, 510, 210],
    });
    expect(grid.getItems().map((item) => item.cssRect)).to.be.deep.equals([
      { width: 120, left: 0, top: 0 },
      { width: 120, left: 160, top: 0 },
      { width: 120, left: 320, top: 0 },
      { width: 120, left: 480, top: 0 },
    ]);
    expect(container!.style.height).to.be.deep.equals("500px");
  });
  it(`should check if it is aligned with start`, async () => {
    // Given
    container!.style.cssText = "width: 600px; height: 600px;";
    container!.innerHTML = `
      <div style="position: absolute;width: 200px; height: 200px;"></div>
      <div style="position: absolute;width: 150px; height: 150px;"></div>
      <div style="position: absolute;width: 300px; height: 300px;"></div>
      <div style="position: absolute;width: 250px; height: 250px;"></div>
    `;
    grid = new MasonryGrid(container!, {
      align: "start",
      gap: 10,
    });

    // When
    grid.renderItems();

    await waitEvent(grid, "renderComplete");

    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [0, 0],
      end: [470, 470],
    });

    expect(grid.getItems().map((item) => item.cssRect)).to.be.deep.equals([
      { left: 0, top: 0 },
      { left: 210, top: 0 },
      { left: 210, top: 160 },
      { left: 0, top: 210 },
    ]);
    expect(container!.style.height).to.be.deep.equals("460px");
  });
  it(`should check if it is aligned with center`, async () => {
    // Given
    container!.style.cssText = "width: 600px; height: 600px;";
    container!.innerHTML = `
      <div style="position: absolute;width: 200px; height: 200px;"></div>
      <div style="position: absolute;width: 150px; height: 150px;"></div>
      <div style="position: absolute;width: 300px; height: 300px;"></div>
      <div style="position: absolute;width: 250px; height: 250px;"></div>
    `;
    grid = new MasonryGrid(container!, {
      align: "center",
      gap: 10,
    });

    // When
    grid.renderItems();

    await waitEvent(grid, "renderComplete");

    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [0, 0],
      end: [470, 470],
    });

    expect(grid.getItems().map((item) => item.cssRect)).to.be.deep.equals([
      { left: 95, top: 0 },
      { left: 305, top: 0 },
      { left: 305, top: 160 },
      { left: 95, top: 210 },
    ]);
    expect(container!.style.height).to.be.deep.equals("460px");
  });
  it(`should check if it is aligned with end`, async () => {
    // Given
    container!.style.cssText = "width: 600px; height: 600px;";
    container!.innerHTML = `
      <div style="position: absolute;width: 200px; height: 200px;"></div>
      <div style="position: absolute;width: 150px; height: 150px;"></div>
      <div style="position: absolute;width: 300px; height: 300px;"></div>
      <div style="position: absolute;width: 250px; height: 250px;"></div>
    `;
    grid = new MasonryGrid(container!, {
      align: "end",
      gap: 10,
    });

    // When
    grid.renderItems();

    await waitEvent(grid, "renderComplete");

    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [0, 0],
      end: [470, 470],
    });

    expect(grid.getItems().map((item) => item.cssRect)).to.be.deep.equals([
      { left: 190, top: 0 },
      { left: 400, top: 0 },
      { left: 400, top: 160 },
      { left: 190, top: 210 },
    ]);
    expect(container!.style.height).to.be.deep.equals("460px");
  });
  it(`should check if it is aligned with stretch`, async () => {
    // Given
    container!.style.cssText = "width: 600px; height: 600px;";
    container!.innerHTML = `
      <div style="position: absolute;width: 200px; height: 200px;"></div>
      <div style="position: absolute;width: 150px; height: 150px;"></div>
      <div style="position: absolute;width: 300px; height: 300px;"></div>
      <div style="position: absolute;width: 250px; height: 250px;"></div>
    `;
    grid = new MasonryGrid(container!, {
      align: "stretch",
      gap: 10,
      column: 2,
    });

    // When
    grid.renderItems();

    await waitEvent(grid, "renderComplete");

    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [0, 0],
      end: [470, 470],
    });

    expect(grid.getItems().map((item) => item.cssRect)).to.be.deep.equals([
      { width: 295, left: 0, top: 0 },
      { width: 295, left: 305, top: 0 },
      { width: 295, left: 305, top: 160 },
      { width: 295, left: 0, top: 210 },
    ]);
    expect(container!.style.height).to.be.deep.equals("460px");
  });
  it(`should check if the ratio of the size of all items is 1:2`, async () => {
    // Given
    container!.style.cssText = "width: 600px; height: 600px;";
    container!.innerHTML = `
      <div style="position: absolute;width: 200px; height: 200px;"></div>
      <div style="position: absolute;width: 150px; height: 150px;"></div>
      <div style="position: absolute;width: 300px; height: 300px;"></div>
      <div style="position: absolute;width: 250px; height: 250px;"></div>
    `;
    grid = new MasonryGrid(container!, {
      align: "stretch",
      gap: 10,
      column: 2,
      columnSizeRatio: 0.5,
    });

    // When
    grid.renderItems();

    await waitEvent(grid, "renderComplete");

    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [0, 0],
      end: [1200, 1200],
    });
    expect(grid.getItems().map((item) => item.cssRect)).to.be.deep.equals([
      { width: 295, height: 590, left: 0, top: 0 },
      { width: 295, height: 590, left: 305, top: 0 },
      { width: 295, height: 590, left: 0, top: 600 },
      { width: 295, height: 590, left: 305, top: 600 },
    ]);
    expect(container!.style.height).to.be.deep.equals("1190px");
  });
  it(`should Check if the outline is set to the maximum when recalculating the outline`, async () => {
    // Given
    container!.style.cssText = "width: 600px; height: 600px;";
    container!.innerHTML = `
      <div style="position: absolute;width: 100px; height: 200px;"></div>
      <div style="position: absolute;width: 100px; height: 150px;"></div>
      <div style="position: absolute;width: 100px; height: 300px;"></div>
      <div style="position: absolute;width: 100px; height: 250px;"></div>
    `;
    grid = new MasonryGrid(container!, {
      gap: 5,
      useFit: false,
    });

    // When
    // [0, 0, 0, 0]
    grid.renderItems();

    await waitEvent(grid, "renderComplete");

    grid.renderItems({
      outline: [0, 100, 50],
    });

    await waitEvent(grid, "renderComplete");

    // Then
    expect(grid.getOutlines().start).to.be.deep.equals([100, 100, 100, 100]);
  });
  it(`should check whether the column is calculated as the first item`, async () => {
    // Given
    container!.style.cssText = "width: 600px; height: 600px;";
    grid = new MasonryGrid(container!, {
      gap: 5,
    });

    // When
    grid.setItems([
      new GridItem(false, {
        rect: { width: 150, height: 150, top: 0, left: 0 },
      }),
      new GridItem(false, {
        rect: { width: 150, height: 150, top: 0, left: 0 },
      }),
      new GridItem(false, {
        rect: { width: 150, height: 150, top: 0, left: 0 },
      }),
    ]);


    grid.renderItems();

    await waitEvent(grid, "renderComplete");

    // Then
    expect(grid.getOutlines()).to.be.deep.equals({
      start: [0, 0, 0],
      end: [155, 155, 155],
    });
  });
});

