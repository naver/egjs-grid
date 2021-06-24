<template>
  <div class="root">
    <div class="result" ref="result"></div>
    <button class="button" @click="onClick">Resize Item 2</button>
    <masonry-grid
      ref="grid"
      class="container"
      v-bind:gap="gap"
      v-bind:defaultDirection="defaultDirection"
      v-bind:align="align"
      v-bind:column="column"
      v-bind:columnSize="columnSize"
      v-bind:columnSizeRatio="columnSizeRatio"
      @renderComplete="onRenderComplete"
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
    </masonry-grid>
  </div>
</template>
<script lang="ts">
import { MasonryGrid } from "../../../src";

export default {
  props: [
    "gap",
    "defaultDirection",
    "align",
    "column",
    "columnSize",
    "columnSizeRatio",
  ],
  components: {
    MasonryGrid,
  },
  methods: {
    onRenderComplete(e) {
       this.$refs.result.innerHTML = `updated: ${e.updated.length}`;
    },
    onClick() {
      const grid = this.$refs.grid;
      const items = grid.getItems();

      console.log(grid);

      items[1].element.style.height = "150px";
      grid.updateItems([items[1]]);
    },
  },
};
</script>
<style>
html, body {
  position: relative;
  height: 100%;
  padding: 0!important;
  margin: 0!important;
}

.item {
  position: absolute;
  width: 100px;
  color: white;
  text-align: center;
}

.item:nth-child(6n + 1) {
  background: #f55;
  height: 200px;
}

.item:nth-child(6n + 2) {
  background: #7e7;
  height: 300px;
}

.item:nth-child(6n + 3) {
  background: #66e;
  height: 200px;
}

.item:nth-child(6n + 4) {
  background: #4af;
  height: 100px;
}

.item:nth-child(6n + 5) {
  background: #ed5;
  height: 150px;
}
.item:nth-child(6n + 6) {
  background: #d5e;
  height: 130px;
}

.result {
  text-align: center;
  padding: 10px;
  font-weight: bold;
  box-sizing: border-box;
  font-size: 14px;
}
.button {
  position: relative;
  display: block;
  margin: 10px auto;
  padding: 10px 20px;
  background: white;
  border: 1px solid #ccc;
  appearance: none;
  font-weight: bold;
  width: 150px;
  text-align: center;
  box-sizing: border-box;
  font-size: 14px;
}


@media (prefers-color-scheme: dark) {
  .result {
    color: white;
  }
}

@media (prefers-color-scheme: light) {
  .result {
    color: black;
  }
}

</style>
