<p align="middle" ><img src="https://naver.github.io/egjs-grid/images/logo.png" /></p>
<h2 align="middle">Grid</h2>
<p align="middle">
<a href="https://www.npmjs.com/package/@egjs/grid" target="_blank"><img src="https://img.shields.io/npm/v/@egjs/grid.svg?style=flat-square&color=007acc&label=version" alt="npm version" /></a>&nbsp;
<img src="https://img.shields.io/badge/language-typescript-blue.svg?style=flat-square" />&nbsp;
<a href="https://github.com/naver/egjs-grid/actions" target="_blank"><img alt="Github actions" src="https://img.shields.io/github/actions/workflow/status/naver/egjs-grid/run-e2e.yml?branch=main&style=flat-square" /></a>&nbsp;
<a href="https://coveralls.io/github/naver/egjs-grid?branch=main&style=flat-square" target="_blank"><img alt="Coveralls github" src="https://img.shields.io/coveralls/github/naver/egjs-grid.svg?style=flat-square&label=%E2%9C%85%20coverage" /></a>&nbsp;
<a href="https://github.com/naver/egjs-grid/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/static/v1?style=flat-square&label=license&message=MIT&color=08CE5D" /></a>&nbsp;
<a href="https://github.com/naver/egjs-grid/tree/main/packages/react-grid" target="_blank"><img alt="React" src="https://img.shields.io/static/v1.svg?label=&message=React&style=flat-square&color=61daeb" /></a>&nbsp;
<a href="https://github.com/naver/egjs-grid/tree/main/packages/ngx-grid" target="_blank"><img alt="Angular" src="https://img.shields.io/static/v1.svg?label=&message=Angular&style=flat-square&color=C82B38" /></a>&nbsp;
<a href="https://github.com/naver/egjs-grid/tree/main/packages/vue-grid" target="_blank"><img
    alt="Vue"
    src="https://img.shields.io/static/v1.svg?label=&message=Vue&style=flat-square&color=3fb984" /></a>&nbsp;
<a href="https://github.com/naver/egjs-grid/tree/main/packages/svelte-grid" target="_blank"><img alt="Svelte" src="https://img.shields.io/static/v1.svg?label=&message=Svelte&style=flat-square&color=C82B38" /></a>
</p>
<p align="middle">A component that can arrange items according to the type of grids.</p>
<p align="middle">
    <a href="https://naver.github.io/egjs-grid" target="_blank"><strong>Demo</strong></a> /&nbsp;
    <a href="https://naver.github.io/egjs-grid/release/latest/doc/" target="_blank"><strong>API</strong></a>
</p>


## Grids

|<img src="https://naver.github.io/egjs-grid/images/MasonryGrid.png" />|<img src="https://naver.github.io/egjs-grid/images/JustifiedGrid.png" />|<img src="https://naver.github.io/egjs-grid/images/FrameGrid.png" />|<img src="https://naver.github.io/egjs-grid/images/PackingGrid.png" />|
|:---:|:---:|:---:|:---:|
|[**MasonryGrid**](http://naver.github.io/egjs-grid/storybook/?path=/story/examples-masonrygrid--masonry-grid-template)|[**JustifiedGrid**](http://naver.github.io/egjs-grid/storybook/?path=/story/examples-justifiedgrid--justified-grid-template)|[**FrameGrid**](http://naver.github.io/egjs-grid/storybook/?path=/story/examples-framegrid--frame-grid-template)|[**PackingGrid**](http://naver.github.io/egjs-grid/storybook/?path=/story/examples-packinggrid--packing-grid-template)|

* **MasonryGrid**: The MasonryGrid is a grid that stacks items with the same width as a stack of bricks. Adjust the width of all images to the same size, find the lowest height column, and insert a new item.
* **JustifiedGrid**: 'justified' is a printing term with the meaning that 'it fits in one row wide'. The JustifiedGrid is a grid that the item is filled up on the basis of a line given a size.
* **FrameGrid**: 'Frame' is a printing term with the meaning that 'it fits in one row wide'. The FrameGrid is a grid that the item is filled up on the basis of a line given a size.
* **PackingGrid**: The PackingGrid is a grid that shows the important items bigger without sacrificing the weight of the items. Rows and columns are separated so that items are dynamically placed within the horizontal and vertical space rather than arranged in an orderly fashion.


## Documents
- [Get Started and Demos](https://naver.github.io/egjs-grid/)
- [API documentation](https://naver.github.io/egjs-grid/release/latest/doc/)

## Download and Installation

Download dist files from repo directly or install it via npm.

```bash
$ npm install @egjs/grid
```

```html
<script src="//naver.github.io/egjs-grid/release/latest/dist/grid.min.js"></script>
```

## How to use
```js
import { MasonryGrid, JustifiedGrid, FrameGrid, PackingGrid } from "@egjs/grid";


// Grid.MasonryGrid
const grid = new MasonryGrid(container, {
  gap: 5,
});

grid.renderItems();
```

## Use Faster & Lazy Rendering

* When the `loading="lazy"` or `data-grid-lazy="true"`(external lazy loading) attribute is used, Rendering of the items occurs immediately. When items are loaded, they are rendered sequentially.
```html
<img src="..." />
<img src="..." />
<img src="..." loading="lazy" />
<img data-grid-lazy="true" />
```
* If you use `data-grid-width` and `data-grid-height` attributes, the size of self, child image, and video elements is automatically adjusted until loading is complete.
```html
<div data-grid-width="100" data-grid-height="100">
   <img src="..." />
   <img src="..." />
   <img src="..." />
</div>
```

* If you use `data-grid-skip="true"` attribute, you can omit it even if there are images in itself and child image, and video elements.
```html
<div data-grid-skip="true">
   <img src="..." />
   <img src="..." />
   <img src="..." />
</div>
```

## Detect resize of Container & Children
Grid calculates the size of container and children by window resizing event. However, even if the size of the window does not change, the size of the event container and children can change. Most of the first rendering issues are also like this.

In this case, I recommend [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) for you.

Provides `useResizeObserver` option to detect size change of container and `observeChildren` option to detect size change of children.


```js
import { MasonryGrid, JustifiedGrid, FrameGrid, PackingGrid } from "@egjs/grid";


// Grid.MasonryGrid
const grid = new MasonryGrid(container, {
  gap: 5,
  useResizeObserver: true,
  observeChildren: true,
});

grid.renderItems();
```

## Pre-guess size for performance or invisible items.
### What if all items were the same size?
If you use the `isEqualSize` option, all items are considered to be the same size.
Each resize only calculates the size of one item.
Add `data-grid-not-equal-size="true"` attribute if there is an exceptional item whose size needs to be calculated while using isEqualSize.
```html
<div class="item item1"></div>
<div class="item item1"></div>
<div class="item item1"></div>
<!--item2 is a different size than item1.-->
<div class="item item2" data-grid-not-equal-size="true"></div>
```

### What if a size group exists?

`isEqualSize` assumes all items are equal. But if there are more than two size-groups, use `data-grid-size-group`.


```html
<!--item1 has the same size.-->
<div class="item item1" data-grid-size-group="1"></div>
<div class="item item1" data-grid-size-group="1"></div>
<!--item2 has the same size.-->
<div class="item item2" data-grid-size-group="2"></div>
<div class="item item2" data-grid-size-group="2"></div>
```


### What if all items don't change size?
If all items do not have a constant size, use the `isConstantSize` option. Resizing doesn't calculate the item's size.
If you want to recalculate, use `.updateItems(items, { useOrgResize: true })` method or `.renderItems({ useOrgResize: true })` method.



## Packages
|Package|Version|Description|
|:-----:|:-----:|:-----:|
|[**@egjs/react-grid**](https://github.com/naver/egjs-grid/blob/main/packages/react-grid/README.md)|<a href="https://www.npmjs.com/package/@egjs/react-grid" target="_blank"><img src="https://img.shields.io/npm/v/@egjs/react-grid.svg?style=flat-square&color=00d8ff&label=%F0%9F%94%96" alt="version" /></a>|[React](https://reactjs.org/) port of @egjs/grid|
|[**@egjs/ngx-grid**](https://github.com/naver/egjs-grid/blob/main/packages/ngx-grid/README.md)|<a href="https://www.npmjs.com/package/@egjs/ngx-grid" target="_blank"><img src="https://img.shields.io/npm/v/@egjs/ngx-grid.svg?style=flat-square&color=dd0031&label=%F0%9F%94%96" alt="version" /></a>| [Angular](https://angular.io/) port of @egjs/grid|
|[**@egjs/vue-grid**](https://github.com/naver/egjs-grid/blob/main/packages/vue-grid/README.md)|<a href="https://www.npmjs.com/package/@egjs/vue-grid" target="_blank"><img src="https://img.shields.io/npm/v/@egjs/vue-grid.svg?style=flat-square&color=42b883&label=%F0%9F%94%96" alt="version" /></a>| [Vue.js](https://vuejs.org/v2/guide/index.html) port of @egjs/grid|
|[**@egjs/svelte-grid**](https://github.com/naver/egjs-grid/blob/main/packages/svelte-grid/README.md)|<a href="https://www.npmjs.com/package/@egjs/svelte-grid" target="_blank"><img src="https://img.shields.io/npm/v/@egjs/svelte-grid.svg?style=flat-square&color=ff3d00&label=%F0%9F%94%96" alt="version" /></a>| [Svelte](https://svelte.dev/) port of @egjs/grid|


## Supported Browsers
The following are the supported browsers.

|Internet Explorer|Chrome|Firefox|Safari|iOS|Android|
|---|---|---|---|---|---|
|9+|Latest|Latest|Latest|7+|4+(polyfill 2.2+)|



## How to start developing egjs-grid?

For anyone interested to develop egjs-grid, follow the instructions below.

### Development Environment

#### 1. Clone the repository

Clone the egjs-grid repository and install the dependency modules.

```bash
# Clone the repository.
$ git clone https://github.com/naver/egjs-grid.git
```

#### 2. Install dependencies

```
# Install the dependency modules.
$ npm install
```
### 3. `npm start`

Run `storybook` for development.

Open [http://localhost:6006](http://localhost:6006) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### 3. `npm build`

Use npm script to build Grid

```bash
$ npm run build
```

Two folders will be created after complete build is completed.

- **dist** folder: Includes the **grid.js** and **grid.min.js** files.
- **doc** folder: Includes API documentation. The home page for the documentation is **doc/index.html**.

### Linting

To keep the same code style, we adopted [ESLint](http://eslint.org/) to maintain our code quality. The [rules](https://github.com/naver/eslint-config-naver/tree/main/rules) are modified version based on [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).
Setup your editor for check or run below command for linting.

```bash
$ npm run lint
```

### Test

Once you created a branch and done with development, you must perform a test running with `npm test` command before your push the code to a remote repository.

```bash
$ npm run test
```
Running `npm test` command will start [Mocha](https://mochajs.org/) tests via [Karma-runner](https://karma-runner.github.io/).


## Bug Report

If you find a bug, please report to us opening a new [Issues](https://github.com/naver/egjs-grid/issues) on GitHub.


## License
egjs-grid is released under the [MIT license](https://github.com/naver/egjs/blob/master/LICENSE.txt).

```
Copyright (c) 2021-present NAVER Corp.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
