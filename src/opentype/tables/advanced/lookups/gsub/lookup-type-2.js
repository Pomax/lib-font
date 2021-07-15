import { LookupType } from "./gsub-lookup.js";

class LookupType2 extends LookupType {
  constructor(p) {
    super(p);
    this.sequenceCount = p.uint16;
    this.sequenceOffsets = [...new Array(this.sequenceCount)].map(
      (_) => p.Offset16
    );
  }
  getSequence(index) {
    let p = this.parser;
    p.currentPosition = this.start + this.sequenceOffsets[index];
    return new SequenceTable(p);
  }
}

class SequenceTable {
  constructor(p) {
    this.glyphCount = p.uint16;
    this.substituteGlyphIDs = [...new Array(this.glyphCount)].map(
      (_) => p.uint16
    );
  }
}

export { LookupType2 };
