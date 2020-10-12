import lazy from "../../../../lazy.js";

class Format13 {
  constructor(p) {
    this.format = 13;
    p.uint16;
    this.length = p.uint32;
    this.language = p.uint32;
    this.numGroups = p.uint32;
    const getter = [...new Array(this.numGroups)].map(
      (_) => new ConstantMapGroup(p)
    );
    lazy(this, `groups`, getter);
  }

  supports(charCode) {
    if (charCode.charCodeAt) charCode = charCode.charCodeAt(0);
    return (
      this.groups.findIndex(
        (s) => s.startCharCode <= charCode && charCode <= s.endCharCode
      ) !== -1
    );
  }

  reverse(glyphID) {
    console.warn(`reverse not implemented for cmap subtable format 13`);
  }

  getSupportedCharCodes(preservePropNames = false) {
    if (preservePropNames) return this.groups;
    return this.groups.map((v) => ({
      start: v.startCharCode,
      end: v.endCharCode,
    }));
  }
}

class ConstantMapGroup {
  constructor(p) {
    this.startCharCode = p.uint32;
    this.endCharCode = p.uint32;
    this.glyphID = p.uint32;
  }
}

export { Format13 };
