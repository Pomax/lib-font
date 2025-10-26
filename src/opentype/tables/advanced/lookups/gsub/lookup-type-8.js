import { LookupType } from "./gsub-lookup.js";

class LookupType8 extends LookupType {
  type = 8;
  constructor(p) {
    super(p);
    this.backtrackGlyphCount = p.uint16;
    this.backtrackCoverageOffsets = [
      ...new Array(this.backtrackGlyphCount),
    ].map((_) => p.Offset16);
    this.lookaheadGlyphCount = p.uint16;
    this.lookaheadCoverageOffsets = [new Array(this.lookaheadGlyphCount)].map(
      (_) => p.Offset16
    );
    this.glyphCount = p.uint16;
    this.substituteGlyphIDs = [...new Array(this.glyphCount)].map(
      (_) => p.uint16
    );
  }
}

export { LookupType8 };
