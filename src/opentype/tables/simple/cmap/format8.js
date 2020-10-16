import lazy from "../../../../lazy.js";
import { Subtable } from "./subtable.js";

class Format8 extends Subtable {
  constructor(p, platformID, encodingID) {
    super(p, platformID, encodingID);
    this.format = 8;
    p.uint16;
    this.length = p.uint32;
    this.language = p.uint32;
    this.is32 = [...new Array(8192)].map((_) => p.uint8);
    this.numGroups = p.uint32;
    const getter = () =>
      [...new Array(this.numGroups)].map((_) => new SequentialMapGroup(p));
    lazy(this, `groups`, getter);
  }

  supports(charCode) {
    if (charCode.charCodeAt) charCode = charCode.charCodeAt(0);
    return (
      this.groups.findIndex(
        (s) => s.startcharCode <= charCode && charCode <= s.endcharCode
      ) !== -1
    );
  }

  reverse(glyphID) {
    console.warn(`reverse not implemented for cmap subtable format 8`);
    return {};
  }

  getSupportedCharCodes(preservePropNames = false) {
    if (preservePropNames) return this.groups;
    return this.groups.map((v) => ({
      start: v.startcharCode,
      end: v.endcharCode,
    }));
  }
}

class SequentialMapGroup {
  constructor(p) {
    this.startcharCode = p.uint32;
    this.endcharCode = p.uint32;
    this.startGlyphID = p.uint32;
  }
}

export { Format8 };
