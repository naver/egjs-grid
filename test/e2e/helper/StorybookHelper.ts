
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
}

module.exports = StorybookHelper;
