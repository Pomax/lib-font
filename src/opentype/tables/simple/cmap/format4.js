import lazy from "../../../../lazy.js";
import { ParsedData } from "../../../../parser.js";

class Format4 {
  constructor(p) {
    this.format = 4;
    this.length = p.uint16;
    this.language = p.uint16;
    this.segCountX2 = p.uint16;
    this.segCount = this.segCountX2 / 2;
    this.searchRange = p.uint16;
    this.entrySelector = p.uint16;
    this.rangeShift = p.uint16;

    // This cmap subformat basically lazy-loads everything. It would be better to
    // not even lazy load but the code is not ready for selective extraction.

    const endCodePosition = p.currentPosition;
    lazy(this, `endCode`, () =>
      p.readBytes(this.segCount, endCodePosition, 16)
    );

    const startCodePosition = endCodePosition + 2 + this.segCountX2;
    lazy(this, `startCode`, () =>
      p.readBytes(this.segCount, startCodePosition, 16)
    );

    const idDeltaPosition = startCodePosition + this.segCountX2;
    lazy(this, `idDelta`, () =>
      p.readBytes(this.segCount, idDeltaPosition, 16, true) // Note that idDelta values are signed
    );

    const idRangePosition = idDeltaPosition + this.segCountX2;
    lazy(this, `idRangeOffset`, () =>
      p.readBytes(this.segCount, idRangePosition, 16)
    );

    const glyphIdArrayPosition = idRangePosition + this.segCountX2;
    const glyphIdArrayLength = this.length - (glyphIdArrayPosition - this.tableStart);
    lazy(this, `glyphIdArray`, () =>
      p.readBytes(glyphIdArrayLength, glyphIdArrayPosition, 16)
    );

    // also, while not in the spec, we really want to organise all that data into convenient segments
    lazy(this, `segments`, () => this.buildSegments(idRangePosition, glyphIdArrayPosition, p));
  }

  buildSegments(idRangePosition, glyphIdArrayPosition, p) {
    const build = (_, i) => {
      let startCode = this.startCode[i],
          endCode = this.endCode[i],
          idDelta = this.idDelta[i],
          idRangeOffset = this.idRangeOffset[i],
          idRangeOffsetPointer = idRangePosition + 2*i,
          glyphIDs = [];

      // simple case
      if (idRangeOffset === 0) {
        for(let i=startCode + idDelta, e=endCode + idDelta; i<=e; i++) {
          glyphIDs.push(i);
        }
      }

      // not so simple case
      else {
        for(let i=0, e=endCode-startCode; i<=e; i++) {
          p.currentPosition = idRangeOffsetPointer + idRangeOffset + i*2;
          glyphIDs.push(p.uint16);
        }
      }

      return { startCode, endCode, idDelta, idRangeOffset, glyphIDs };
    };

    return [...new Array(this.segCount)].map(build);
  }

  reverse(glyphID) {
    let s = this.segments.find(v => v.glyphIDs.includes(glyphID));
    if (!s) return;
    return s.startCode + s.glyphIDs.indexOf(glyphID);
  }

  getGlyphId(charCode) {
    if (charCode.charCodeAt) charCode = charCode.charCodeAt(0);
    let segment = this.segments.find(s =>
      s.startCode <= charCode && charCode <= s.endCode
    );
    if (!segment) return 0;
    return segment.glyphIDs[charCode - segment.startCode];
  }

  supports(charCode) {
    return this.getGlyphId(charCode) !== 0;
  }

  getSupportedCharCodes(preservePropNames = false) {
    if (preservePropNames) return this.segments;
    return this.segments.map((v) => ({ start: v.startCode, end: v.endCode }));
  }
}

export { Format4 };
