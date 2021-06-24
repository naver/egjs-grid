
function getEventArgs(storyId: string, args: Record<string, any>) {
  return {
    "key": "storybook-channel",
    "event": {
      "type": "updateStoryArgs",
      "args": [
        {
          "storyId": storyId,
          "updatedArgs": args,
        },
      ],
    },
  };
}


class StorybookHelper extends Helper {
  public async updateArgs(storyId: string, args: Record<string, any>) {
    const I = this.helpers.Playwright as CodeceptJS.I;

    const data = JSON.stringify(getEventArgs(storyId, args));

    await I.executeScript(`
  window.postMessage(${"`"}${data}${"`"});
  `);
  }
  public async waitImageLoaded() {
    const I = this.helpers.Playwright as CodeceptJS.I;
    await I.executeScript(`
    window.isLoaded = false;

    const imgs = document.querySelectorAll("img");
    let loadCount = 0;
    let imgsLengh = imgs.length;

    function load() {
      setTimeout(() => {
        isLoaded = imgsLengh === ++loadCount;
      }, 100);
    }
    imgs.forEach(img => {
      if (img.complete) {
        load();
      } else {
        img.addEventListener("load", () => {
          load();
        }, {
          once: true,
        });
      }
    });
  `);

    await I.waitForFunction(() => (window as any).isLoaded, 100);
  }
}

export default StorybookHelper;
module.exports = StorybookHelper;
