import fs from "fs";
import path from "path";
import assert from "assert";

function getPath(fileName: string) {
  return path.resolve("./test/e2e/log", fileName.replace(/[,:<>"|*?{}]/g, ""));
}

class HTMLHelper extends Helper {
  public async saveElementJSON(selector: string, fileName: string) {
    const json = await this._readElementJSON(selector);
    fs.writeFileSync(getPath(fileName), JSON.stringify(json, null, 2));
  }
  public async seeJSONDiffForElement(selector: string, fileName: string) {
    const targetJSON = await this._readElementJSON(selector);
    const baseJSON = fs.readFileSync(getPath(fileName), { encoding: "utf-8" });


    assert.deepStrictEqual(targetJSON, JSON.parse(baseJSON), "jsons are not same");

  }
  private async _readElementJSON(selector: string) {
    const I = this.helpers.Playwright as CodeceptJS.I;

    return await I.executeScript(`(() => {
      function convertElementToJSON(element) {
        const tag = element.tagName.toLowerCase();
        const cssText = element.style.cssText;
        const style = {};
        cssText.split(";").forEach(v => {
          if (!v) {
            return;
          }
          const [name = "", value = ""] = v.split(":");
          style[name.trim()] = value.trim();
        });
        return {
          tag,
          style,
          offsetWidth: element.offsetWidth,
          offsetHeight: element.offsetHeight,
          children: [].slice.call(element.children).map((child) => convertElementToJSON(child)),
          innerText: element.innerText.trim(),
        };
      }
      return convertElementToJSON(document.querySelector(${"`"}${selector}${"`"}));
    })()`);
  }
}

export default HTMLHelper;
module.exports = HTMLHelper;

