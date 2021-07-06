<script>
  import { MasonryGrid } from "../../../src/";

  export let gap;
  export let defaultDirection;
  export let align;
  export let column;
  export let columnSize;
  export let columnSizeRatio;
</script>

<MasonryGrid
  class="container"
  {defaultDirection}
  {gap}
  {align}
  {column}
  {columnSize}
  {columnSizeRatio}
>
  <div class="item" data-grid-column="4">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item">5</div>
  <div class="item">6</div>
  <div class="item">7</div>
  <div class="item" data-grid-column="3">8</div>
  <div class="item">9</div>
  <div class="item">10</div>
</MasonryGrid>
