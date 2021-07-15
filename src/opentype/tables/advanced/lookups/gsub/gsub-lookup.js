import { ParsedData } from "../../../../../parser.js";
import { CoverageTable } from "../../shared/coverage.js";

function undoCoverageOffsetParsing(instance) {
  instance.parser.currentPosition -= 2;
  delete instance.coverageOffset;
  delete instance.getCoverageTable;
}

class LookupType extends ParsedData {
  constructor(p) {
    super(p);
    this.substFormat = p.uint16;
    this.coverageOffset = p.Offset16;
  }
  getCoverageTable() {
    let p = this.parser;
    p.currentPosition = this.start + this.coverageOffset;
    return new CoverageTable(p);
  }
}

// used by types 5 and 6
class SubstLookupRecord {
  constructor(p) {
    this.glyphSequenceIndex = p.uint16; // Index into current glyph sequence — first glyph = 0.
    this.lookupListIndex = p.uint16; // Lookup to apply to that position — zero-based index.
  }
}

export { undoCoverageOffsetParsing, LookupType, SubstLookupRecord };
