import { ContainerManager } from "../../src/ContainerManager";
import { cleanup, sandbox } from "./utils/utils";

describe("test ContainerManager", () => {
  let containerManager: ContainerManager | null;
  let el: HTMLElement | null;

  beforeEach(() => {
    el = sandbox("");
  });

  afterEach(() => {
    if (containerManager) {
      containerManager.destroy();
    }
    el = null;
    cleanup();
  });
  [false, true].forEach((horizontal) => {
    it(`ContainerManager initialization (horizontal: ${horizontal})`, () => {
      // Given
      el!.style.cssText = "width: 200px; height: 100px;";
      const originalPosition = getComputedStyle(el!).position;

      // When
      containerManager = new ContainerManager(el!, {
        horizontal,
      });

      // Then
      expect(originalPosition).to.be.equals("static");
      expect(el!.style.position).to.be.equals("relative");
    });

    it(`should check inline size, containerManager size (horizontal: ${horizontal})`, () => {
      // Given
      el!.style.cssText = "width: 200px; height: 100px;";

      containerManager = new ContainerManager(el!, {
        horizontal,
      });

      // When
      containerManager.resize();

      // Then
      if (horizontal) {
        // height
        expect(containerManager.getInlineSize()).to.be.equals(100);
        // width
        expect(containerManager.getContentSize()).to.be.equals(200);
      } else {
        // width
        expect(containerManager.getInlineSize()).to.be.equals(200);
        // height
        expect(containerManager.getContentSize()).to.be.equals(100);
      }
    });
    it(`should check if getContentSize() and element's style change with calling setContentSize() (horizontal: ${horizontal})`, () => {
      // Given
      el!.style.cssText = "width: 200px; height: 100px;";

      containerManager = new ContainerManager(el!, {
        horizontal,
      });
      containerManager.resize();

      // When
      containerManager.setContentSize(300);

      // Then
      expect(containerManager.getContentSize()).to.be.equals(300);
      expect(el!.style[horizontal ? "width" : "height"]).to.be.equals("300px");
    });

    it(`should check get status and restore status`, () => {
      // Given
      el!.style.cssText = "width: 100px; height: 100px;";

      containerManager = new ContainerManager(el!, {
        horizontal,
      });
      containerManager.resize();
      const status = containerManager.getStatus();

      containerManager.setContentSize(300);

      // When
      containerManager.setStatus(status);

      // Then
      expect(containerManager.getContentSize()).to.be.equals(100);
      expect(el!.style[horizontal ? "width" : "height"]).to.be.equals("100px");
    });
    it(`should check if destroy returns to original css.`, () => {
      // Given
      el!.style.cssText = "width: 200px; height: 100px;";

      const cssText = el!.style.cssText;
      containerManager = new ContainerManager(el!, {
        horizontal,
      });

      // When
      containerManager.resize();
      containerManager.setContentSize(300);

      const cssText2 = el!.style.cssText;

      containerManager.destroy();
      containerManager = null;

      const cssText3 = el!.style.cssText;

      // Then
      expect(cssText).to.be.not.equals(cssText2);
      expect(cssText2).to.be.not.equals(cssText3);
      expect(cssText).to.be.equals(cssText3);
    });
    it(`should checks whether the UI is preserved if you use the preserveUI option when call destory method.`, () => {
      // Given
      el!.style.cssText = "width: 200px; height: 100px;";

      const cssText = el!.style.cssText;
      containerManager = new ContainerManager(el!, {
        horizontal,
      });

      // When
      containerManager.resize();
      containerManager.setContentSize(300);

      const cssText2 = el!.style.cssText;

      containerManager.destroy({
        preserveUI: true,
      });
      containerManager = null;

      const cssText3 = el!.style.cssText;

      // Then
      expect(cssText).to.be.not.equals(cssText2);
      expect(cssText2).to.be.equals(cssText3);
    });
  });
});
