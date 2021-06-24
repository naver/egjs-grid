<script>
  import { JustifiedGrid } from "../../../src/";

  export let gap;
  export let defaultDirection;
  export let rowRange;
  export let columnRange;
  export let sizeRange;
  export let isCroppedSize;
  export let displayedRow;
</script>

<JustifiedGrid
  class="container"
  {defaultDirection}
  {gap}
  {rowRange}
  {columnRange}
  {sizeRange}
  {isCroppedSize}
  {displayedRow}
>
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item">5</div>
  <div class="item">6</div>
  <div class="item">7</div>
  <div class="item">8</div>
  <div class="item">9</div>
  <div class="item">10</div>
</JustifiedGrid>
