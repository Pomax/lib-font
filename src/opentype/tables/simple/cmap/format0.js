import { Subtable } from "./subtable.js";

class Format0 extends Subtable {
  constructor(p, platformID, encodingID) {
    super(p, platformID, encodingID);
    this.format = 0;
    this.length = p.uint16;
    this.language = p.uint16;
    // this isn't worth lazy-loading
    this.glyphIdArray = [...new Array(256)].map((_) => p.uint8);
  }

  supports(charCode) {
    if (charCode.charCodeAt) {
      // TODO: FIXME: map this character to a number based on the Apple standard character to glyph mapping
      charCode = -1;
      console.warn(
        `supports(character) not implemented for cmap subtable format 0. only supports(id) is implemented.`
      );
    }
    return 0 <= charCode && charCode <= 255;
  }

  reverse(glyphID) {
    console.warn(`reverse not implemented for cmap subtable format 0`);
    return {};
  }

  getSupportedCharCodes() {
    return [{ start: 1, end: 256 }];
  }
}

export { Format0 };
