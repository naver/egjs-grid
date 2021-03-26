<script>
  import { FrameGrid } from "../../../src/";

  export let gap;
  export let defaultDirection;
  export let frame;
  export let rectSize;
  export let useFrameFill;
</script>

<FrameGrid
  class="container"
  {defaultDirection}
  {gap}
  {frame}
  {rectSize}
  {useFrameFill}
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
</FrameGrid>
