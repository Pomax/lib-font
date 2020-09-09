import { ParsedData } from "../../../../parser.js";

class CoverageTable extends ParsedData {
  constructor(p) {
    super(p);

    this.coverageFormat = p.uint16;

    if (this.coverageFormat === 1) {
      this.glyphCount = p.uint16;
      this.glyphArray = [...new Array(this.glyphCount)].map((_) => p.uint16);
    }

    if (this.coverageFormat === 2) {
      this.rangeCount = p.uint16;
      this.rangeRecords = [...new Array(this.rangeCount)].map(
        (_) => new CoverageRangeRecord(p)
      );
    }
  }
}

class CoverageRangeRecord {
  constructor(p) {
    this.startGlyphID = p.uint16;
    this.endGlyphID = p.uint16;
    this.startCoverageIndex = p.uint16;
  }
}

export { CoverageTable };
