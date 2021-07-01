<template>
  <justified-grid
    class="container"
    v-bind:gap="gap"
    v-bind:defaultDirection="defaultDirection"
    v-bind:columnRange="columnRange"
    v-bind:rowRange="rowRange"
    v-bind:sizeRange="sizeRange"
    v-bind:isCroppedSize="isCroppedSize"
    v-bind:displayedRow="displayedRow"
  >
    <div class="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/1.jpg" data-grid-maintained-target="" alt="image1" />
      <div class="title">Item 1</div>
    </div>
    <div class="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/2.jpg" data-grid-maintained-target="" alt="image2" />
      <div class="title">Item 2</div>
    </div>
    <div class="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/3.jpg" data-grid-maintained-target="" alt="image3" />
      <div class="title">Item 3</div>
    </div>
    <div class="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/4.jpg" data-grid-maintained-target="" alt="image4" />
      <div class="title">Item 4</div>
    </div>
    <div class="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/5.jpg" data-grid-maintained-target="" alt="image5" />
      <div class="title">Item 5</div>
    </div>
    <div class="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/6.jpg" data-grid-maintained-target="" alt="image6" />
      <div class="title">Item 6</div>
    </div>
    <div class="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/7.jpg" data-grid-maintained-target="" alt="image7" />
      <div class="title">Item 7</div>
    </div>
    <div class="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/8.jpg" data-grid-maintained-target="" alt="image8" />
      <div class="title">Item 8</div>
    </div>
    <div class="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/9.jpg" data-grid-maintained-target="" alt="image9" />
      <div class="title">Item 9</div>
    </div>
    <div class="image">
      <img
        src="https://naver.github.io/egjs-infinitegrid/assets/image/10.jpg" data-grid-maintained-target=""
      />
      <div class="title">Item 10</div>
    </div>
  </justified-grid>
</template>
<script>
import { JustifiedGrid } from "../../../src";
export default {
  props: [
    "gap",
    "defaultDirection",
    "columnRange",
    "rowRange",
    "sizeRange",
    "isCroppedSize",
    "displayedRow",
  ],
  components: {
    JustifiedGrid,
  },
};
</script>
<style>
html,
body {
  position: relative;
  height: 100%;
  padding: 0 !important;
  margin: 0 !important;
}
.container {
  overflow: hidden;
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

.image {
  position: relative;
  width: 100%;
  font-size: 0;
}
.image img {
  width: 100%;
}

.title {
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
}
@media (prefers-color-scheme: dark) {
  .title {
    color: white;
  }
}

@media (prefers-color-scheme: light) {
  .title {
    color: black;
  }
}
</style>
