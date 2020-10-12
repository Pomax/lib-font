import { SimpleTable } from "../../simple-table.js";

/**
 * The OpenType `VDMX` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/VDMX
 */
class VDMX extends SimpleTable {
  constructor(dict, dataview) {
    const { p } = super(dict, dataview);
    this.version = p.uint16;
    this.numRecs = p.uint16;
    this.numRatios = p.uint16;
    this.ratRanges = [...new Array(this.numRatios)].map(
      (_) => new RatioRange(p)
    );
    this.offsets = [...new Array(this.numRatios)].map((_) => p.offset16); // start of this table to the VDMXGroup table for a corresponding RatioRange record.
    this.VDMXGroups = [...new Array(this.numRecs)].map((_) => new VDMXGroup(p));
  }
}

class RatioRange {
  constructor(p) {
    this.bCharSet = p.uint8;
    this.xRatio = p.uint8;
    this.yStartRatio = p.uint8;
    this.yEndRatio = p.uint8;
  }
}

class VDMXGroup {
  constructor(p) {
    this.recs = p.uint16;
    this.startsz = p.uint8;
    this.endsz = p.uint8;
    this.records = [...new Array(this.recs)].map((_) => new vTable(p));
  }
}

class vTable {
  constructor(p) {
    this.yPelHeight = p.uint16;
    this.yMax = p.int16;
    this.yMin = p.int16;
  }
}

export { VDMX };
