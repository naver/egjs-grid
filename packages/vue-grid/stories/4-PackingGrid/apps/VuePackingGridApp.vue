<template>
  <packing-grid
    class="container"
    v-bind:gap="gap"
    v-bind:defaultDirection="defaultDirection"
    v-bind:sizeWeight="sizeWeight"
    v-bind:ratioWeight="ratioWeight"
    v-bind:aspectRatio="aspectRatio"
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
  </packing-grid>
</template>
<script>
import { PackingGrid } from '../../../src';

export default {
  props: [
    "gap",
    "defaultDirection",
    "sizeWeight",
    "ratioWeight",
    "aspectRatio",
  ],
  components: {
    PackingGrid,
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
