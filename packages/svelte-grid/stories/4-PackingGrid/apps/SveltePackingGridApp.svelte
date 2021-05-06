<script>
  import { PackingGrid } from "../../../src/";

  export let gap;
  export let defaultDirection;
  export let sizeWeight;
  export let ratioWeight;
  export let aspectRatio;
  export let weightPriority;
</script>

<PackingGrid
  class="container"
  {defaultDirection}
  {gap}
  {sizeWeight}
  {ratioWeight}
  {aspectRatio}
  {weightPriority}
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
</PackingGrid>
