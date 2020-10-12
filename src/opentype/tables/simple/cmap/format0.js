class Format0 {
  constructor(p) {
    this.format = 0;
    this.length = p.uint16;
    this.language = p.uint16;
    // this isn't worth lazy-loading
    this.glyphIdArray = [...new Array(256)].map((_) => p.uint8);
  }

  supports(charCode) {
    if (charCode.charCodeAt) charCode = charCode.charCodeAt(0);
    return 0 <= charCode && charCode <= 255;
  }

  getSupportedCharCodes() {
    return [{ start: 1, end: 256 }];
  }
}

export { Format0 };
