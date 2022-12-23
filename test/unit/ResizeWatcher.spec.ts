import * as sinon from "sinon";
import { ResizeWatcher } from "../../src";
import { cleanup, sandbox, waitFor } from "./utils/utils";

describe.only("test ResizeObserver", () => {
  let watcher!: ResizeWatcher;
  let container!: HTMLElement;

  beforeEach(() => {
    const root = sandbox("")!;
    root.innerHTML = `
    <style>
    .sample {
      position: relative;
      width: 200px;
      height: 100px;
    }
    </style>
    <div class="sample"></div>`;
    container = document.querySelector<HTMLElement>(".sample")!;
  });
  afterEach(() => {
    watcher?.destroy();
    (watcher as any) = null;
    (container as any) = null;
    cleanup();
  });
  it(`should check if resize works even if there is no resize contentRectSize or blockRectSize in safari 15.3 or less`, async () => {
    // Given
    watcher = new ResizeWatcher(container);

    const resizeSpy = sinon.spy();
    watcher.listen(resizeSpy);

    // When
    // Test like safari 15.3
    await waitFor(100);
    (watcher as any)._onObserve([
      {
        contentRect: {
          width: 201,
          height: 100,
        },
      },
    ]);

    await waitFor(100);

    // Then
    expect(resizeSpy.callCount).to.be.equals(1);
    expect(resizeSpy.args[0][0].childEntries[0].size.inlineSize).to.be.equals(201);
    expect(resizeSpy.args[0][0].childEntries[0].size.blockSize).to.be.equals(100);
  });
});
