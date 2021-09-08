import { GridItem } from "../../src";
import { JustifiedGrid } from "../../src/grids/JustifiedGrid";
import {
  appendElements, cleanup, expectItemsPosition,
  getRowCount, getRowPoses, sandbox, waitEvent,
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
  it(`should check whether the ratio is maintained except for the offset when the inline offset is set`, async () => {
    // Given
    container!.style.cssText = "width: 1000px;";

    grid = new JustifiedGrid(container!, {
      gap: 5,
      horizontal: false,
    });

    appendElements(container!, 18).forEach((element) => {
      element.setAttribute("data-grid-inline-offset", "20");
    });

    // When
    grid.renderItems();

    await waitEvent(grid, "renderComplete");

    const items = grid.getItems();

    // Then
    expectItemsPosition(items);
    items.forEach((item) => {
      const cssRatio = (item.cssInlineSize - 20) / item.cssContentSize;
      const orgRatio = (item.orgInlineSize - 20) / item.orgContentSize;

      expect(cssRatio).to.be.closeTo(orgRatio, 0.00001);
    });
  });
  it(`should check whether the offset of the updated items is recalculated`, async () => {
    // Given
    container!.style.cssText = "width: 1000px;";

    grid = new JustifiedGrid(container!, {
      gap: 5,
      horizontal: false,
    });

    appendElements(container!, 8);
    grid.renderItems();

    await waitEvent(grid, "renderComplete");

    const items = grid.getItems();

    // When
    items.slice(0, 4).forEach((item) => {
      item.isUpdate = true;
      item.attributes = {
        contentOffset: "20",
      };
    });

    grid.applyGrid(grid.getItems(), "end", [0]);

    // Then
    expectItemsPosition(items);
    items.forEach((item, i) => {
      const cssRatio = item.cssInlineSize / (item.cssContentSize - 20);
      const orgRatio = item.orgInlineSize / (item.orgContentSize - 20);

      if (i < 4) {
        // update
        expect(cssRatio).to.be.closeTo(orgRatio, 0.00001, `index: ${i}`);
      } else {
        // not update
        expect(cssRatio).to.be.not.closeTo(orgRatio, 0.00001, `index: ${i}`);
      }
    });
  });
  it(`should check whether the ratio is maintained except for the offset when the content offset is set`, async () => {
    // Given
    container!.style.cssText = "width: 1000px;";

    grid = new JustifiedGrid(container!, {
      gap: 5,
      horizontal: false,
    });

    appendElements(container!, 18).forEach((element) => {
      element.style.width = "100%";
      element.style.height = "auto";
      element.innerHTML += `<div data-grid-maintained-target style="padding-top: 40%;width: 100%;"></div>content...`;
    });

    // When
    grid.renderItems();

    await waitEvent(grid, "renderComplete");

    const items = grid.getItems();

    // Then
    expectItemsPosition(items);
    items.forEach((item) => {
      expect(item.element!.clientHeight).to.be.closeTo(item.element!.scrollHeight, 0.00001);
    });
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
    it(`should check if it is visible less than the actual rendered rowCount`, async () => {
      // Given
      container!.style.cssText = "width: 1000px;";

      grid = new JustifiedGrid(container!, {
        gap: 5,
        horizontal: false,
        rowRange: [4, 4],
        displayedRow: 2,
      });

      appendElements(container!, 18);

      // When
      grid.renderItems();

      await waitEvent(grid, "renderComplete");

      const items = grid.getItems();
      const rowPoses = getRowPoses(items);

      // Then
      expectItemsPosition(items);
      expect(rowPoses.length).to.be.equals(4);
      // gap = 5
      expect(rowPoses[2]).to.be.equals(grid.getOutlines().end[0]);
    });
    it("should check if rendering with cached data", async () => {
      // Given
      container!.style.cssText = "width: 500px;";

      grid = new JustifiedGrid(container!, {
        gap: 0,
        horizontal: false,
      });

      // When
      grid.setItems([
        new GridItem(false, {
          orgRect: { left: 0, top: 0, width: 100, height: 100 },
          gridData: { inlineOffset: 50, contentOffset: 80 },
        }),
      ]);
      grid.renderItems();

      await waitEvent(grid, "renderComplete");

      const items = grid.getItems();

      // Then
      // (100 - 50) : (100 - 80) = 5 : 2
      // 5 : 2 = (500 - 50) : 180
      // height = 180 + 80
      expect(items[0].cssRect.width).to.be.equals(500);
      expect(items[0].cssRect.height).to.be.equals(260);
    });
  });

  describe("test isCroppedSize  option", () => {
    it(`should check if the ratio is broken but the contentSize is constant`, async () => {
      // Given
      container!.style.cssText = "width: 1000px;";

      grid = new JustifiedGrid(container!, {
        gap: 5,
        horizontal: false,
        isCroppedSize: true,
        sizeRange: [200, 200],
        rowRange: [4, 4],
      });

      appendElements(container!, 18);

      // When
      grid.renderItems();

      await waitEvent(grid, "renderComplete");

      const items = grid.getItems();
      const rowCount = getRowCount(items);

      // Then
      expect(rowCount).to.be.equals(4);
      expectItemsPosition(items);
      items.forEach((item) => {
        expect(item.cssContentSize).to.be.equals(200);
      });
    });
  });
});
