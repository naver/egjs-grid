import { getUpdatedItems, GridItem } from "../../src";
import { SampleGridFramework } from "./samples/SampleGridFramework";
import { cleanup, sandbox } from "./utils/utils";


describe("test utils", () => {
  let grid: SampleGridFramework | null;
  let container: HTMLElement | null;

  beforeEach(() => {
    container = sandbox("");
  });

  afterEach(() => {
    grid = null;
    container = null;
    cleanup();
  });

  describe("test withGridMethods", () => {
    it("should check if the method works well in the framework", () => {
      // Given
      grid = new SampleGridFramework(container!);


      // When
      const result1 = grid.getItems();

      // this return type is grid
      const result2 = grid.setItems([]);

      const sampleContainer = grid.getContainerElement();

      // Then
      expect(result1).to.be.deep.equals([]);
      expect(result2).to.be.equals(grid);
      expect(sampleContainer).to.be.equals(container);
    });
  });
  describe("test getUpdatedItems", () => {
    it("should check if items are not updated when size is the same", () => {
      // Given
      const element = document.createElement("div");
      const items = [
        new GridItem(false, {
          element,
          orgRect: {
            width: 100,
            height: 100,
            top: 0,
            left: 0,
          },
          rect: {
            width: 100,
            height: 100,
            top: 0,
            left: 0,
          },
        }),
      ];

      // When
      const updated = getUpdatedItems(items, [{
        target: element,
        size: { inlineSize: 100, blockSize: 100 },
      }]);

      // Then
      expect(updated).to.be.lengthOf(0);
    });
    it("should check if item is updated when size is 0", () => {
      // Given
      const element = document.createElement("div");
      const items = [
        new GridItem(false, {
          element,
          orgRect: {
            width: 100,
            height: 100,
            top: 0,
            left: 0,
          },
        }),
      ];

      // When
      // Even if size is the same as orgRect, the size of item's rect is 0.
      const updated = getUpdatedItems(items, [{
        target: element,
        size: { inlineSize: 100, blockSize: 100 },
      }]);

      // Then
      expect(updated[0]).to.be.equals(items[0]);
    });
  });
});
