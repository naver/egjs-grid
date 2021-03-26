export interface BoxModelStatus {
  orgInlineSize: number;
  orgContentSize: number;
  inlineSize: number;
  contentSize: number;
  inlinePos: number;
  contentPos: number;
  items: BoxModel[];
}

export default class BoxModel implements BoxModelStatus {
  public orgInlineSize: number;
  public orgContentSize: number;
  public inlineSize: number;
  public contentSize: number;
  public inlinePos: number;
  public contentPos: number;
  public items: BoxModel[];
  constructor(status: Partial<BoxModelStatus>) {
    const boxStatus = {
      orgInlineSize: 0,
      orgContentSize: 0,
      inlineSize: 0,
      contentSize: 0,
      inlinePos: 0,
      contentPos: 0,
      items: [],
      ...status,
    };
    for (const name in boxStatus) {
      this[name] = boxStatus[name];
    }
  }
  public scaleTo(inlineSize: number, contentSize: number) {
    const scaleX = this.inlineSize ? inlineSize / this.inlineSize : 0;
    const scaleY = this.contentSize ? contentSize / this.contentSize : 0;

    this.items.forEach((item) => {
      if (scaleX !== 0) {
        item.inlinePos *= scaleX;
        item.inlineSize *= scaleX;
      }
      if (scaleY !== 0) {
        item.contentPos *= scaleY;
        item.contentSize *= scaleY;
      }
    });

    this.inlineSize = inlineSize;
    this.contentSize = contentSize;
  }
  public push(item: BoxModel) {
    this.items.push(item);
  }
  public getOrgSizeWeight() {
    return this.orgInlineSize * this.orgContentSize;
  }
  public getSize() {
    return this.inlineSize * this.contentSize;
  }
  public getOrgRatio() {
    return (this.orgContentSize === 0) ? 0 : this.orgInlineSize / this.orgContentSize;
  }
  public getRatio() {
    return (this.contentSize === 0) ? 0 : this.inlineSize / this.contentSize;
  }
}
