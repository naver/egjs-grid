<script>
  import { MasonryGrid } from "../../../src/";

  export let gap;
  export let defaultDirection;
  export let align;
  export let column;
  export let columnSize;
  export let columnSizeRatio;
  let result;
  let grid;
</script>

<div class="root">
  <div class="result" bind:this={result}></div>
  <button
    class="button"
    on:click={() => {
      const items = grid.getItems();

      items[1].element.style.height = "150px";
      grid.updateItems([items[1]]);
    }}>Resize Item 2</button
  >
  <MasonryGrid
    bind:this={grid}
    class="container"
    {defaultDirection}
    {gap}
    {align}
    {column}
    {columnSize}
    {columnSizeRatio}
    on:renderComplete={({ detail: e }) => {
      result.innerHTML = `updated: ${e.updated.length}`;
    }}
  >
    <div class="item">1</div>
    <div class="item item2">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
    <div class="item">5</div>
    <div class="item">6</div>
    <div class="item">7</div>
    <div class="item">8</div>
    <div class="item">9</div>
    <div class="item">10</div>
  </MasonryGrid>
</div>
