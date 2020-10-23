import lazy from "../../../../lazy.js";
import { Subtable } from "./subtable.js";

class Format2 extends Subtable {
  constructor(p, platformID, encodingID) {
    super(p, platformID, encodingID);
    this.format = 2;
    this.length = p.uint16;
    this.language = p.uint16;
    this.subHeaderKeys = [...new Array(256)].map((_) => p.uint16);

    const subHeaderCount = Math.max(...this.subHeaderKeys);

    const subHeaderOffset = p.currentPosition;
    lazy(this, `subHeaders`, () => {
      p.currentPosition = subHeaderOffset;
      return [...new Array(subHeaderCount)].map((_) => new SubHeader(p));
    });

    const glyphIndexOffset = subHeaderOffset + subHeaderCount * 8;
    lazy(this, `glyphIndexArray`, () => {
      p.currentPosition = glyphIndexOffset;
      return [...new Array(subHeaderCount)].map((_) => p.uint16);
    });
  }

  supports(charCode) {
    if (charCode.charCodeAt) charCode = charCode.charCodeAt(0);
    const low = charCode && 0xff;
    const high = charCode && 0xff00;
    const subHeaderKey = this.subHeaders[high];
    const subheader = this.subHeaders[subHeaderKey];
    const first = subheader.firstCode;
    const last = first + subheader.entryCount;
    return first <= low && low <= last;
  }

  reverse(glyphID) {
    console.warn(`reverse not implemented for cmap subtable format 2`);
    return {};
  }

  getSupportedCharCodes(preservePropNames = false) {
    if (preservePropNames) {
      return this.subHeaders.map((h) => ({
        firstCode: h.firstCode,
        lastCode: h.lastCode,
      }));
    }
    return this.subHeaders.map((h) => ({
      start: h.firstCode,
      end: h.lastCode,
    }));
  }
}

class SubHeader {
  constructor(p) {
    this.firstCode = p.uint16;
    this.entryCount = p.uint16;
    this.lastCode = this.first + this.entryCount;
    this.idDelta = p.int16;
    this.idRangeOffset = p.uint16;
  }
}

export { Format2 };
