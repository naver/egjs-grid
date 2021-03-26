import { JustifiedGrid } from "../../src/grids/JustifiedGrid";
import {
  appendElements, cleanup, expectItemsPosition,
  getRowCount, sandbox, waitEvent,
} from "./utils/utils";


describe("test JustifiedGrid", () => {
  let grid: JustifiedGrid | null;
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
    grid = new JustifiedGrid(container!, {
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
  describe("test columnRange option", () => {
    [0, 10, 20].forEach((gap) => {
      it(`should check if there are 3 columns (gap = ${gap})`, async () => {
        // Given
        container!.style.cssText = "width: 1000px;";

        grid = new JustifiedGrid(container!, {
          gap,
          columnRange: [3, 3],
        });

        appendElements(container!, 20);

        // When
        grid.renderItems();

        await waitEvent(grid, "renderComplete");
        const items = grid.getItems();
        const maxInlinePos = Math.max(...items.map((item) => item.cssInlinePos + item.cssInlineSize));

        // Then
        expect(maxInlinePos).to.be.closeTo(1000, 0.00001);
        for (let i = 0; i < Math.floor(20 / 3); ++i) {
          // other row
          expect(items[i * 3].cssContentPos).to.be.not.equal(items[(i + 1) * 3].cssContentPos);

          // same row
          expect(items[i * 3].cssContentPos).to.be.equal(items[i * 3 + 1].cssContentPos);
          expect(items[i * 3].cssContentPos).to.be.equal(items[i * 3 + 2].cssContentPos);
        }
      });
      it(`should check if there are 2 to 5 columns in a row (gap = ${gap})`, async () => {
        // Given
        container!.style.cssText = "width: 1000px;";

        grid = new JustifiedGrid(container!, {
          gap,
          columnRange: [2, 5],
        });

        appendElements(container!, 20);

        // When
        grid.renderItems();

        await waitEvent(grid, "renderComplete");
        const items = grid.getItems();
        const maxInlinePos = Math.max(...items.map((item) => item.cssInlinePos + item.cssInlineSize));

        // Then
        expect(maxInlinePos).to.be.closeTo(1000, 0.00001);
        let start = 0;
        for (let i = 1; i < 20; ++i) {
          if (items[i - 1].cssContentPos !== items[i].cssContentPos) {
            expect(i - start).to.be.at.least(2);
            expect(i - start).to.be.at.most(5);

            start = i;
          }
        }
      });
    });
  });
  describe("test sizeRange option", () => {
    [0, 10, 20].forEach((gap) => {
      it(`should check if all items are minSize(200) or more (gap = ${gap})`, async () => {
        // Given
        container!.style.cssText = "width: 800px;";
        grid = new JustifiedGrid(container!, {
          gap,
          sizeRange: [200, Infinity],
        });

        // When
        grid.renderItems();

        await waitEvent(grid, "renderComplete");

        const items = grid.getItems();

        // Then
        items.forEach((item) => {
          expect(item.cssContentSize).to.at.least(200);
        });
      });
      it(`should check if all items are maxSize(300) or less (gap = ${gap})`, async () => {
        // Given
        container!.style.cssText = "width: 800px;";
        grid = new JustifiedGrid(container!, {
          gap,
          sizeRange: [0, 300],
        });

        // When
        grid.renderItems();

        await waitEvent(grid, "renderComplete");

        const items = grid.getItems();

        // Then
        items.forEach((item) => {
          expect(item.cssContentSize).to.be.below(300);
        });
      });
      it(`should check if all items are minSize(200) or more and maxSize(300) or less (gap = ${gap})`, async () => {
        // Given
        container!.style.cssText = "width: 800px;";
        grid = new JustifiedGrid(container!, {
          gap,
          sizeRange: [200, 300],
        });

        // When
        grid.renderItems();

        await waitEvent(grid, "renderComplete");

        const items = grid.getItems();

        // Then
        items.forEach((item) => {
          expect(item.cssRect.height).to.at.least(200);
          expect(item.cssRect.height).to.below(300);
        });
      });
    });
  });
  describe("test rowRange option", () => {
    it(`should check if rowCount is enough (column * row = itemCount)`, async () => {
      // Given
      container!.style.cssText = "width: 1000px;";

      grid = new JustifiedGrid(container!, {
        gap: 5,
        horizontal: false,
        columnRange: [4, 5],
        rowRange: [4, 5],
      });

      appendElements(container!, 18);

      // When
      grid.renderItems();

      await waitEvent(grid, "renderComplete");

      const items = grid.getItems();
      const rowCount = getRowCount(items);

      // Then
      expectItemsPosition(items);
      expect(rowCount).to.be.equals(4);
    });
    it(`should check if rowCount is not enough (column * row > itemCount)`, async () => {
      // Given
      container!.style.cssText = "width: 1000px;";

      grid = new JustifiedGrid(container!, {
        gap: 5,
        horizontal: false,
        columnRange: [4, 5],
        rowRange: [4, 5],
      });

      appendElements(container!, 10);

      // When
      grid.renderItems();

      await waitEvent(grid, "renderComplete");

      const items = grid.getItems();
      const rowCount = getRowCount(items);

      // Then
      expectItemsPosition(items);
      expect(rowCount).to.be.equals(3);
    });
    it(`should check if rowCount is exceeded (column * row < itemCount)`, async () => {
      // Given
      container!.style.cssText = "width: 1000px;";

      grid = new JustifiedGrid(container!, {
        gap: 5,
        horizontal: false,
        columnRange: [4, 5],
        rowRange: [4, 5],
      });

      appendElements(container!, 30);

      // When
      grid.renderItems();

      await waitEvent(grid, "renderComplete");

      const items = grid.getItems();
      const rowCount = getRowCount(items);

      // Then
      expectItemsPosition(items);
      expect(rowCount).to.be.equals(6);
    });
    it(`should check if rowCount is 1 (column > itemCount)`, async () => {
      // Given
      container!.style.cssText = "width: 1000px;";

      grid = new JustifiedGrid(container!, {
        gap: 5,
        horizontal: false,
        columnRange: [4, 5],
        rowRange: [4, 5],
      });

      appendElements(container!, 3);

      // When
      grid.renderItems();

      await waitEvent(grid, "renderComplete");

      const items = grid.getItems();
      const rowCount = getRowCount(items);

      // Then
      expectItemsPosition(items);
      expect(rowCount).to.be.equals(1);
    });
  });
});
