
import { GridItem } from "../../src/GridItem";

describe("test GridItem", () => {
  [true, false].forEach((horizontal) => {
    it(`should check if computed returns css rect pos when css rect pos exists (horizontal: ${horizontal})`, () => {
      // Given, When
      const item = new GridItem(horizontal, {
        rect: {
          width: 50,
          height: 50,
          top: 50,
          left: 0,
        },
        cssRect: {
          width: 100,
          top: 100,
          left: 50,
        },
      });
      const item2 = new GridItem(horizontal, {
        rect: {
          width: 50,
          height: 50,
          top: 50,
          left: 0,
        },
        cssRect: {
          width: 100,
          top: 0,
          left: 0,
        },
      });

      // Then
      if (horizontal) {
        expect(item.computedInlinePos).to.be.equals(100);
        expect(item.computedContentPos).to.be.equals(50);
      } else {
        expect(item.computedInlinePos).to.be.equals(50);
        expect(item.computedContentPos).to.be.equals(100);
      }
      // exist top, left
      expect(item2.computedInlinePos).to.be.equals(0);
      expect(item2.computedContentPos).to.be.equals(0);
    });
    it(`should check if computed returns rect pos when css rect pos not exists (horizontal: ${horizontal})`, () => {
      // Given, When
      const item = new GridItem(horizontal, {
        rect: {
          width: 50,
          height: 50,
          top: 50,
          left: 0,
        },
        cssRect: {
          width: 100,
        },
      });

      // Then
      if (horizontal) {
        expect(item.computedInlinePos).to.be.equals(50);
        expect(item.computedContentPos).to.be.equals(0);
      } else {
        expect(item.computedInlinePos).to.be.equals(0);
        expect(item.computedContentPos).to.be.equals(50);
      }
    });
    it(`should check if computed returns css rect size when css rect size > 0 (horizontal: ${horizontal})`, () => {
      // Given, When
      const item = new GridItem(horizontal, {
        rect: {
          width: 50,
          height: 50,
          top: 0,
          left: 0,
        },
        cssRect: {
          width: 100,
          height: 150,
        },
      });

      // Then
      if (horizontal) {
        expect(item.computedInlineSize).to.be.equals(150);
        expect(item.computedContentSize).to.be.equals(100);
      } else {
        expect(item.computedInlineSize).to.be.equals(100);
        expect(item.computedContentSize).to.be.equals(150);
      }
    });
    it(`should check if computed returns rect size when css rect size = 0 (horizontal: ${horizontal})`, () => {
      // Given, When
      const item = new GridItem(horizontal, {
        rect: {
          width: 50,
          height: 150,
          top: 50,
          left: 0,
        },
        cssRect: {
          width: 0,
          height: 0,
        },
      });

      // Then
      if (horizontal) {
        expect(item.computedInlineSize).to.be.equals(150);
        expect(item.computedContentSize).to.be.equals(50);
      } else {
        expect(item.computedInlineSize).to.be.equals(50);
        expect(item.computedContentSize).to.be.equals(150);
      }
    });
  });
});
