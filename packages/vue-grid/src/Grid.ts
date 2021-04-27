import { ShapeFlags } from "@vue/shared";


function hForVue3(instance: any) {
  return function h(type: string, props: any, children: any[]) {
    let ref = null;

    if (props.ref) {
      ref = {
        i: instance.$,
        r: props.ref,
      };
    }
    return {
      // https://github.com/vuejs/vue-next/blob/master/packages/shared/src/shapeFlags.ts
      // ELEMENT 1, CHILDREN 16
      shapeFlag: 17,
      type,
      props,
      ref,
      children,
    }
  };
}

/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */
export default {
  render(this: any, h1: any) {
    const h = typeof h1 === "function" ? h1 : hForVue3(this);

    let slots = this.$slots.default;

    if (typeof slots === "function") {
      slots = slots();
    }
    return h(
      "div",
      {
        ref: "container",
      },
      slots
    );
  },
};
