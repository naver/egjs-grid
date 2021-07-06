<template>
  <masonry-grid
    class="container"
    v-bind:gap="gap"
    v-bind:defaultDirection="defaultDirection"
    v-bind:align="align"
    v-bind:column="column"
    v-bind:columnSize="columnSize"
    v-bind:columnSizeRatio="columnSizeRatio"
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
  </masonry-grid>
</template>
<script>
import { MasonryGrid } from '../../../src';

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
  }
}
</script>
<style>
html, body {
  position: relative;
  height: 100%;
}

.item {
  position: absolute;
  width: 100px;
  /* border: 1px solid #ccc; */
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
</style>
