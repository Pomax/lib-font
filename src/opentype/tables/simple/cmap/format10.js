import lazy from "../../../../lazy.js";

// basically Format 6, but for 32 bit characters
class Format10 {
  constructor(p) {
    this.format = 10;
    p.uint16;
    this.length = p.uint32;
    this.language = p.uint32;
    this.startCharCode = p.uint32;
    this.numChars = p.uint32;
    this.endCharCode = this.startCharCode + this.numChars;
    const getter = () => [...new Array(this.numChars)].map((_) => p.uint16);
    lazy(this, `glyphs`, getter);
  }

  supports(charCode) {
    if (charCode.charCodeAt) charCode = charCode.charCodeAt(0);
    if (charCode < this.startCharCode) return false;
    if (charCode > this.startCharCode + this.numChars) return false;
    return charCode - this.startCharCode;
  }

  reverse(glyphID) {
    console.warn(`reverse not implemented for cmap subtable format 10`);
    return {};
  }

  getSupportedCharCodes(preservePropNames = false) {
    if (preservePropNames) {
      return [
        { startCharCode: this.startCharCode, endCharCode: this.endCharCode },
      ];
    }
    return [{ start: this.startCharCode, end: this.endCharCode }];
  }
}

export { Format10 };
