import lazy from "../../../../lazy.js";

class Format6 {
  constructor(p) {
    this.format = 6;
    this.length = p.uint16;
    this.language = p.uint16;
    this.firstCode = p.uint16;
    this.entryCount = p.uint16;
    this.lastCode = this.firstCode + this.entryCount - 1;

    const getter = () => [...new Array(this.entryCount)].map((_) => p.uint16);
    lazy(this, `glyphIdArray`, getter);
  }

  supports(charCode) {
    if (charCode.charCodeAt) charCode = charCode.charCodeAt(0);
    if (charCode < this.firstCode) return false;
    if (charCode > this.firstCode + this.entryCount) return false;
    return charCode - this.firstCode;
  }

  reverse(glyphID) {
    let pos = this.glyphIdArray.indexOf(glyphID);
    if (pos > -1) return this.firstCode + pos;
  }

  getSupportedCharCodes(preservePropNames = false) {
    if (preservePropNames) {
      return [{ firstCode: this.firstCode, lastCode: this.lastCode }];
    }
    return [{ start: this.firstCode, end: this.lastCode }];
  }
}

export { Format6 };
