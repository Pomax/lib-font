import { LookupType } from "./gsub-lookup.js";

class LookupType3 extends LookupType {
  type = 3;
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

export { LookupType3 };
