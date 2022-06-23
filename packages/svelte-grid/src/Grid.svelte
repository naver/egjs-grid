<script>
  /**
   * egjs-grid
   * Copyright (c) 2021-present NAVER Corp.
   * MIT license
   */
  import { onMount, beforeUpdate, createEventDispatcher, onDestroy, afterUpdate } from "svelte";
  import { GRID_EVENTS } from "@egjs/grid";
  export let GridClass;

  const dispatch = createEventDispatcher();
  let container;
  let grid;
  let isFirstMount = false;
  let attributes = {};

  function updateAttributes() {
    attributes = { ...$$props };

    const defaultOptions = GridClass.defaultOptions;

    delete attributes["GridClass"];
    for (const name in defaultOptions) {
      delete attributes[name];
    }
  }

  beforeUpdate(() => {
    updateAttributes();
    if (!grid) {
      return;
    }

    const propertyTypes = GridClass.propertyTypes;
    for (const name in propertyTypes) {
      if (name in $$props) {
        grid[name] = $$props[name];
      }
    }
  });
  onMount(() => {
    const defaultOptions = GridClass.defaultOptions;
    const options = {};

    for (const name in defaultOptions) {
      if (name in $$props) {
        options[name] = $$props[name];
      }
    }

    grid = new GridClass(container, options);

    GRID_EVENTS.forEach((name) => {
      grid.on(name, e => {
        dispatch(name, e);
      });
    });
    grid.renderItems();
  });
  afterUpdate(() => {
    if (isFirstMount) {
      isFirstMount = false;
      return;
    }
    const propertyTypes = GridClass.propertyTypes;

    for (const name in propertyTypes) {
      if (name in $$props) {
        grid[name] = $$props[name];
      }
    }
    grid.syncElements();
  });
  onDestroy(() => {
    grid && grid.destroy();
  });
  export function getInstance() {
    return grid;
  }
</script>

<div bind:this={container} {...attributes}>
  <slot />
</div>
