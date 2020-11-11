import lazy from "../../../../lazy.js";
import { Subtable } from "./subtable.js";

// basically Format 8, but for 32 bit characters
class Format12 extends Subtable {
  constructor(p, platformID, encodingID) {
    super(p, platformID, encodingID);
    this.format = 12;
    p.uint16;
    this.length = p.uint32;
    this.language = p.uint32;
    this.numGroups = p.uint32;
    const getter = () =>
      [...new Array(this.numGroups)].map((_) => new SequentialMapGroup(p));
    lazy(this, `groups`, getter);
  }

  supports(charCode) {
    if (charCode.charCodeAt) charCode = charCode.charCodeAt(0);

    // surrogate pair value?
    if (0xd800 <= charCode && charCode <= 0xdfff) return 0;

    // one of the exactly 66 noncharacters?
    if ((charCode & 0xfffe) === 0xfffe || (charCode & 0xffff) === 0xffff)
      return 0;

    return (
      this.groups.findIndex(
        (s) => s.startCharCode <= charCode && charCode <= s.endCharCode
      ) !== -1
    );
  }

  reverse(glyphID) {
    for (let group of this.groups) {
      let start = group.startGlyphID;
      if (start > glyphID) continue;
      if (start === glyphID) return group.startCharCode;
      let end = start + (group.endCharCode - group.startCharCode);
      if (end < glyphID) continue;
      const code = group.startCharCode + (glyphID - start);
      return { code, unicode: String.fromCodePoint(code) };
    }
    return {};
  }

  getSupportedCharCodes(preservePropNames = false) {
    if (preservePropNames) return this.groups;
    return this.groups.map((v) => ({
      start: v.startCharCode,
      end: v.endCharCode,
    }));
  }
}

class SequentialMapGroup {
  constructor(p) {
    this.startCharCode = p.uint32;
    this.endCharCode = p.uint32;
    this.startGlyphID = p.uint32;
  }
}

export { Format12 };
