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
});
