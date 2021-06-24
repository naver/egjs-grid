import Component from "@egjs/component";
import { GridItem } from "../../../src";
import { range } from "../../../src/utils";
import { SIZES } from "./consts";
// import { innerWidth, innerHeight } from "../../src/utils";

export function sandbox(obj: object | string, prop?: object): HTMLElement {
  const tmp = document.createElement("div");
  tmp.className = "_tempSandbox_";
  if (typeof obj === "string") {
    tmp.id = obj;
  } else {
    tmp.id = "sandbox";
  }

  if (typeof obj === "object" || typeof prop === "object") {
    const attrs = typeof prop === "object" ? prop : obj;
    for (const p in attrs as object) {
      if (/class|className/.test(p)) {
        tmp.setAttribute(p, attrs[p] + " _tempSandbox_");
      } else {
        tmp.setAttribute(p, attrs[p]);
      }
    }
  }
  document.body.appendChild(tmp);
  return tmp;
}

export function cleanup() {
  const elements: HTMLElement[] = [].slice.call(document.querySelectorAll("._tempSandbox_"));
  elements.forEach((v) => {
    v.parentNode!.removeChild(v);
  });
}
export function waitFor(delay: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
export function waitEvent(component: Component<any>, eventName: string): Promise<any> {
  return new Promise((resolve) => {
    component.once(eventName, (e) => {
      resolve(e);
    });
  });
}

export function appendElements(container: HTMLElement, count: number) {
  const length = SIZES.length;
  const elements: HTMLElement[] = [];

  for (let i = 0; i < count; ++i) {
    const size = SIZES[i % length];
    const element = document.createElement("div");

    element.style.cssText = `position: absolute; width: ${size[0]}px; height: ${size[1]}px;`;
    container.appendChild(element);
    elements.push(element);
  }
  return elements;
}

export function expectItemsPosition(items: GridItem[]) {
  items.forEach((item) => {
    expect(item.cssContentPos).to.be.at.least(0);
  });
}
export function getRowPosMap(items: GridItem[]) {
  const rowPosMap = {};

  items.forEach((item) => {
    const pos = item.cssContentPos;

    if (pos == null) {
      return;
    }
    if (!rowPosMap[pos]) {
      rowPosMap[pos] = true;
    }
  });
  return rowPosMap;
}
export function getRowPoses(items: GridItem[]) {
  return Object.keys(getRowPosMap(items)).map((num) => parseFloat(num));
}
export function getRowCount(items: GridItem[]) {
  return getRowPoses(items).length;
}

export function chaseItem(
  items: GridItem[],
  item: GridItem,
  gap: number,
  checks: boolean[] = range(items.length).map(() => false),
) {
  items.forEach((nextItem, i) => {
    if (checks[i]) {
      return;
    }
    if (item.cssRect.left! + item.cssRect.width! + gap === nextItem.cssRect.left!) {
      checks[i] = true;
      chaseItem(items, nextItem, gap, checks);
    } else if (item.cssRect.top! + item.cssRect.height! + gap === nextItem.cssRect.top) {
      checks[i] = true;
      chaseItem(items, nextItem, gap, checks);
    } else if (item.cssRect.left! === nextItem.cssRect.left! + nextItem.cssRect.width! + gap) {
      checks[i] = true;
      chaseItem(items, nextItem, gap, checks);
    } else if (item.cssRect.top! === nextItem.cssRect.top! + nextItem.cssRect.height! + gap) {
      checks[i] = true;
      chaseItem(items, nextItem, gap, checks);
    }
  });

  return checks;
}

export function getCost(originLength: number, length: number) {
  let cost = originLength / length;

  if (cost < 1) {
    cost = 1 / cost;
  }

  return cost - 1;
}

export type EventType = {
  eventType: string;
  [key: string]: any;
};
