import { LookupType } from "./gsub.js";

export class LookupType3 extends LookupType {
  constructor(p) {
    super(p);
    this.alternateSetCount = p.uint16;
    this.alternateSetOffsets = [...new Array(this.alternateSetCount)].map(
      (_) => p.Offset16
    );
  }
  getAlternateSet(index) {
    let p = this.parser;
    p.currentPosition = this.start + this.alternateSetOffsets[index];
    return new AlternateSetTable(p);
  }
}

class AlternateSetTable {
  constructor(p) {
    this.glyphCount = p.uint16;
    this.alternateGlyphIDs = [...new Array(this.glyphCount)].map(
      (_) => p.uint16
    );
  }
}
