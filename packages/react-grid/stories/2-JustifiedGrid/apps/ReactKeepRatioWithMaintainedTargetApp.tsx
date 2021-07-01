import React from "react";
import { JustifiedGrid } from "../../../src";

export default function App(props: Record<string, any>) {
  return <JustifiedGrid
    className="container"
    gap={props.gap}
    defaultDirection={props.defaultDirection}
    align={props.align}
    columnRange={props.columnRange}
    rowRange={props.rowRange}
    sizeRange={props.sizeRange}
    isCroppedSize={props.isCroppedSize}
    displayedRow={props.displayedRow}
  >
    <div className="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/1.jpg"
        data-grid-maintained-target="" alt="image1" />
      <div className="title">Item 1</div>
    </div>
    <div className="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/2.jpg"
        data-grid-maintained-target="" alt="image2" />
      <div className="title">Item 2</div>
    </div>
    <div className="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/3.jpg"
        data-grid-maintained-target="" alt="image3" />
      <div className="title">Item 3</div>
    </div>
    <div className="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/4.jpg"
        data-grid-maintained-target="" alt="image4" />
      <div className="title">Item 4</div>
    </div>
    <div className="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/5.jpg"
        data-grid-maintained-target="" alt="image5" />
      <div className="title">Item 5</div>
    </div>
    <div className="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/6.jpg"
        data-grid-maintained-target="" alt="image6" />
      <div className="title">Item 6</div>
    </div>
    <div className="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/7.jpg"
        data-grid-maintained-target="" alt="image7" />
      <div className="title">Item 7</div>
    </div>
    <div className="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/8.jpg"
        data-grid-maintained-target="" alt="image8" />
      <div className="title">Item 8</div>
    </div>
    <div className="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/9.jpg"
        data-grid-maintained-target="" alt="image9" />
      <div className="title">Item 9</div>
    </div>
    <div className="image">
      <img src="https://naver.github.io/egjs-infinitegrid/assets/image/10.jpg"
        data-grid-maintained-target="" alt="image10" />
      <div className="title">Item 10</div>
    </div>
  </JustifiedGrid>;
}
