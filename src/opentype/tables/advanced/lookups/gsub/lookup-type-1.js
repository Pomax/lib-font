import { LookupType } from "./gsub-lookup.js";

class LookupType1 extends LookupType {
  type = 1;
  constructor(p) {
    super(p);

    if (this.format === 1) {
      this.deltaGlyphID = p.uint16;
    }

    if (this.format === 2) {
      this.glyphCount = p.Offset16;
      this.substituteGlyphIDs = [...new Array(this.glyphCount)].map(
        (_) => p.uint16
      );
    }
  }
}

export { LookupType1 };
