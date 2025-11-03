import { ParsedData } from "../../../../../parser.js";

// Not every lookup subtable indicates a coverageOffset, so for
// those few that need it, we want to be able to undo parsing that.
function undoCoverageOffsetParsing(instance) {
  instance.parser.currentPosition -= 2;

  // remove the coverageOffset property binding
  delete instance.coverageOffset;

  // we can't delete a prototype function, but we can undefine it.
  instance.getCoverageTable = undefined;
}

class LookupType extends ParsedData {
  constructor(p) {
    super(p);
    this.format = p.uint16;
    this.coverageOffset = p.Offset16;
  }
}

export { LookupType, undoCoverageOffsetParsing };
