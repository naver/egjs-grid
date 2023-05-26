
import { GridItem } from "../../src/GridItem";
import { ItemRenderer } from "../../src/ItemRenderer";
import { cleanup, sandbox } from "./utils/utils";

describe("test ItemRenderer", () => {
  let itemRenderer: ItemRenderer;
  let el: HTMLElement;

  beforeEach(() => {
    el = sandbox("");
  });

  afterEach(() => {
    cleanup();
  });
  [false, true].forEach((horizontal) => {
    it(`should check changing inline size through setContainerRect (horizontal: ${horizontal})`, () => {
      // Given
      itemRenderer = new ItemRenderer({
        horizontal,
      });

      // When
      itemRenderer.setContainerRect({
        width: 100,
        height: 200,
      });

      // Then
      if (horizontal) {
        expect(itemRenderer.getInlineSize()).to.be.equals(200);
      } else {
        expect(itemRenderer.getInlineSize()).to.be.equals(100);
      }
    });
  });
  it(`should checks whether the item's rect is calculated by calling updateItems`, () => {
    // Given
    el.style.cssText = "position: absolute; left: 50px; top: 50px; width: 200px; height: 100px;";
    itemRenderer = new ItemRenderer({
      horizontal: false,
    });
    const item: GridItem = new GridItem(false, {
      element: el,
    });

    // When
    itemRenderer.updateItems([item]);

    const rect1 = item.rect!;
    el.style.width = "300px";

    // 300 x 100
    itemRenderer.updateItems([item]);
    const rect2 = item.rect!;

    // Then
    expect(item.orgRect!.width).to.be.equals(200);
    expect(item.orgRect!.height).to.be.equals(100);
    expect(item.orgRect!.top).to.be.equals(50);
    expect(item.orgRect!.left).to.be.equals(50);
    expect(rect1.width).to.be.equals(200);
    expect(rect1.height).to.be.equals(100);
    expect(rect1.top).to.be.equals(50);
    expect(rect1.left).to.be.equals(50);
    expect(rect2.width).to.be.equals(300);
    expect(rect2.height).to.be.equals(100);
    expect(rect2.top).to.be.equals(50);
    expect(rect2.left).to.be.equals(50);
  });
  it(`should check if all items are the same size when isEqualSize is true`, () => {
    // Given
    el.style.cssText = "position: absolute; left: 50px; top: 50px; width: 200px; height: 100px;";
    itemRenderer = new ItemRenderer({
      horizontal: false,
      isEqualSize: true,
    });
    const item1: GridItem = new GridItem(false, {
      element: el,
    });
    const item2: GridItem = new GridItem(false, {
      element: el,
    });

    // When
    itemRenderer.updateItems([item1]);

    el.style.width = "300px";
    // When isEqualSize is true, the size is recognized as the same.
    itemRenderer.updateItems([item2]);

    // Then
    expect(item1.orgRect!.width).to.be.equals(200);
    expect(item1.orgRect!.height).to.be.equals(100);
    expect(item1.rect!.width).to.be.equals(200);
    expect(item1.rect!.height).to.be.equals(100);
    expect(item2.orgRect!.width).to.be.equals(200);
    expect(item2.orgRect!.height).to.be.equals(100);
    expect(item2.rect!.width).to.be.equals(200);
    expect(item2.rect!.height).to.be.equals(100);
  });
  it(`should Check if the rect can be updated by resize when isEqualSize is true.`, () => {
    // Given
    el.style.cssText = "position: absolute; left: 50px; top: 50px; width: 200px; height: 100px;";
    itemRenderer = new ItemRenderer({
      horizontal: false,
      isEqualSize: true,
    });
    const item1: GridItem = new GridItem(false, {
      element: el,
    });
    const item2: GridItem = new GridItem(false, {
      element: el,
    });

    // When
    itemRenderer.updateItems([item1]);

    itemRenderer.resize();

    el.style.width = "300px";
    // When isEqualSize is true, the size is recognized as the same.
    itemRenderer.updateItems([item2]);

    // Then
    expect(item1.orgRect!.width).to.be.equals(200);
    expect(item1.orgRect!.height).to.be.equals(100);
    expect(item1.rect!.width).to.be.equals(200);
    expect(item1.rect!.height).to.be.equals(100);
    expect(item2.orgRect!.width).to.be.equals(300);
    expect(item2.orgRect!.height).to.be.equals(100);
    expect(item2.rect!.width).to.be.equals(300);
    expect(item2.rect!.height).to.be.equals(100);
  });
  it(`should check if check if the size is not updated. when isConstantSize is true`, () => {
    // Given
    el.style.cssText = "position: absolute; left: 50px; top: 50px; width: 200px; height: 100px;";
    itemRenderer = new ItemRenderer({
      horizontal: false,
      isConstantSize: true,
    });
    const item: GridItem = new GridItem(false, {
      element: el,
    });

    // When
    itemRenderer.updateItems([item]);

    el.style.width = "300px";
    // When isEqualSize is true, the size is recognized as the same.
    itemRenderer.updateItems([item]);

    // Then
    expect(item.orgRect!.width).to.be.equals(200);
    expect(item.orgRect!.height).to.be.equals(100);
    expect(item.rect!.width).to.be.equals(200);
    expect(item.rect!.height).to.be.equals(100);
  });
  it(`should check if the style is set in the element when the item is rendered`, () => {
    // Given
    el.style.cssText = "";
    itemRenderer = new ItemRenderer({
      horizontal: false,
    });
    itemRenderer.setContainerRect({
      width: 100,
      height: 200,
    });
    const item: GridItem = new GridItem(false, {
      element: el,
      cssRect: {
        left: 100,
        width: 50,
      },
    });

    // When
    itemRenderer.renderItems([item]);

    // Then
    expect(el.style.left).to.be.equals("100px");
    expect(el.style.width).to.be.equals("50px");
    expect(el.style.top).to.be.equals("");
    expect(el.style.height).to.be.equals("");
  });
  it(`should check if transform is used instead of left and top when useTransform is true`, () => {
    // Given
    el.style.cssText = "";
    itemRenderer = new ItemRenderer({
      horizontal: false,
      useTransform: true,
    });
    itemRenderer.setContainerRect({
      width: 100,
      height: 200,
    });
    const item: GridItem = new GridItem(false, {
      element: el,
      cssRect: {
        left: 100,
        width: 50,
      },
    });

    // When
    itemRenderer.renderItems([item]);

    // Then
    expect(el.style.top).to.be.equals("");
    expect(el.style.left).to.be.equals("");
    expect(el.style.transform).to.be.equals("translate(100px, 0px)");
  });
  it(`should check if the style is set in the element when the item is rendered`, () => {
    // Given
    el.style.cssText = "display: block;";
    itemRenderer = new ItemRenderer({
      horizontal: false,
    });
    itemRenderer.setContainerRect({
      width: 100,
      height: 200,
    });
    const item: GridItem = new GridItem(false, {
      element: el,
      cssRect: {
        left: 100,
        width: 50,
      },
    });

    // When
    itemRenderer.renderItems([item]);

    // Then
    expect(el.style.left).to.be.equals("100px");
    expect(el.style.width).to.be.equals("50px");
    expect(el.style.top).to.be.equals("");
    expect(el.style.height).to.be.equals("");
    expect(el.style.display).to.be.equals("block");
  });
  [true, false].forEach((horizontal) => {
    it(`should check if inline pos and size are % when percentage is true (horizontal: ${horizontal})`, () => {
      // Given
      el.style.cssText = "";
      itemRenderer = new ItemRenderer({
        horizontal,
        percentage: true,
      });
      itemRenderer.setContainerRect({
        width: 100,
        height: 200,
      });
      const item: GridItem = new GridItem(horizontal, {
        element: el,
        cssRect: {
          left: 100,
          top: 50,
          width: 50,
          height: 50,
        },
      });

      // When
      itemRenderer.renderItems([item]);

      // Then
      if (horizontal) {
        // top , height are %
        expect(el.style.left).to.be.equals("100px");
        expect(el.style.width).to.be.equals("50px");
        expect(el.style.top).to.be.equals("25%");
        expect(el.style.height).to.be.equals("25%");
      } else {
        // left , width are %
        expect(el.style.left).to.be.equals("100%");
        expect(el.style.width).to.be.equals("50%");
        expect(el.style.top).to.be.equals("50px");
        expect(el.style.height).to.be.equals("50px");
      }
    });
    it(`should check if inline pos is % when percentage is ["position"] (horizontal: ${horizontal})`, () => {
      // Given
      el.style.cssText = "";
      itemRenderer = new ItemRenderer({
        horizontal,
        percentage: ["position"],
      });
      itemRenderer.setContainerRect({
        width: 100,
        height: 200,
      });
      const item: GridItem = new GridItem(horizontal, {
        element: el,
        cssRect: {
          left: 100,
          top: 50,
          width: 50,
          height: 50,
        },
      });

      // When
      itemRenderer.renderItems([item]);

      // Then
      if (horizontal) {
        // top are %
        expect(el.style.left).to.be.equals("100px");
        expect(el.style.width).to.be.equals("50px");
        expect(el.style.top).to.be.equals("25%");
        expect(el.style.height).to.be.equals("50px");
      } else {
        // left are %
        expect(el.style.left).to.be.equals("100%");
        expect(el.style.width).to.be.equals("50px");
        expect(el.style.top).to.be.equals("50px");
        expect(el.style.height).to.be.equals("50px");
      }
    });
    it(`should check if inline size is % when percentage is ["size"] (horizontal: ${horizontal})`, () => {
      // Given
      el.style.cssText = "";
      itemRenderer = new ItemRenderer({
        horizontal,
        percentage: ["size"],
      });
      itemRenderer.setContainerRect({
        width: 100,
        height: 200,
      });
      const item: GridItem = new GridItem(horizontal, {
        element: el,
        cssRect: {
          left: 100,
          top: 50,
          width: 50,
          height: 50,
        },
      });

      // When
      itemRenderer.renderItems([item]);

      // Then
      if (horizontal) {
        // height are %
        expect(el.style.left).to.be.equals("100px");
        expect(el.style.width).to.be.equals("50px");
        expect(el.style.top).to.be.equals("50px");
        expect(el.style.height).to.be.equals("25%");
      } else {
        // width are %
        expect(el.style.left).to.be.equals("100px");
        expect(el.style.width).to.be.equals("50%");
        expect(el.style.top).to.be.equals("50px");
        expect(el.style.height).to.be.equals("50px");
      }
    });
  });
  it(`should check get status and restore status`, () => {
    // Given
    el.style.cssText = "position: absolute; left: 50px; top: 50px; width: 200px; height: 100px;";
    itemRenderer = new ItemRenderer({
      horizontal: false,
      isEqualSize: true,
    });
    itemRenderer.setContainerRect({
      width: 100,
      height: 200,
    });
    const item: GridItem = new GridItem(false, {
      element: el,
    });
    itemRenderer.updateItems([item]);

    // When
    // { left: 50, top: 50, width: 200, height: 100 }
    const status = itemRenderer.getStatus();

    // strange rect
    el.style.cssText = "position: absolute; left: 30px; top: 30px; width: 100px; height: 50px;";

    // reset renderer
    itemRenderer = new ItemRenderer({
      horizontal: false,
      isEqualSize: true,
    });
    itemRenderer.setContainerRect({
      width: 100,
      height: 200,
    });
    itemRenderer.setStatus(status);

    const item2: GridItem = new GridItem(false, {
      element: el,
    });
    itemRenderer.updateItems([item2]);

    // Then
    expect(item2.rect!.width).to.be.equals(200);
    expect(item2.rect!.height).to.be.equals(100);
  });
  it("should check the data attributes.", () => {
    // Given
    el.setAttribute("test", "test");
    el.setAttribute("data-grid-test", "data-grid-test");
    itemRenderer = new ItemRenderer({
      horizontal: false,
    });

    const item: GridItem = new GridItem(false, {
      element: el,
    });

    // When
    itemRenderer.updateItems([item]);

    // Then
    expect(item.attributes).to.be.deep.equals({
      "test": "data-grid-test",
    });
  });
  it("should check if width and height are entered by sizeGroup", () => {
    // Given
    itemRenderer = new ItemRenderer({
      horizontal: false,
    });

    itemRenderer.setStatus({
      initialRects: {
        "0": {
          left: 0,
          top: 0,
          width: 100,
          height: 100,
        },
      },
    });

    const item1 = new GridItem(false, {
      attributes: {
        sizeGroup: 0,
      },
    });
    const item2 = new GridItem(false, {
      attributes: {
        sizeGroup: 1,
      },
    });

    // When
    // update
    itemRenderer.updateItem(item1, true);

    // not update
    itemRenderer.updateItem(item2, true);

    // Then
    expect(item1.rect.width).to.be.deep.equals(100);
    expect(item2.rect.width).to.be.deep.equals(0);
  });

});
