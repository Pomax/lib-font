import { ParsedData } from "../../../../parser.js";
import GSUBtables from "./subtables/gsub.js";
import GPOStables from "./subtables/gpos.js";

class LookupList extends ParsedData {
  static EMPTY = {
    lookupCount: 0,
    lookups: [],
  };

  constructor(p) {
    super(p);
    this.lookupCount = p.uint16;
    this.lookups = [...new Array(this.lookupCount)].map((_) => p.Offset16); // Array of offsets to Lookup tables, from beginning of LookupList
  }
}

class LookupTable extends ParsedData {
  constructor(p, type) {
    super(p);
    this.ctType = type;
    this.lookupType = p.uint16;
    this.lookupFlag = p.uint16;
    this.subTableCount = p.uint16;
    this.subtableOffsets = [...new Array(this.subTableCount)].map(
      (_) => p.Offset16
    ); // Array of offsets to lookup subtables, from beginning of Lookup table
    this.markFilteringSet = p.uint16;
  }
  get rightToLeft() {
    return this.lookupFlag & (0x0001 === 0x0001);
  }
  get ignoreBaseGlyphs() {
    return this.lookupFlag & (0x0002 === 0x0002);
  }
  get ignoreLigatures() {
    return this.lookupFlag & (0x0004 === 0x0004);
  }
  get ignoreMarks() {
    return this.lookupFlag & (0x0008 === 0x0008);
  }
  get useMarkFilteringSet() {
    return this.lookupFlag & (0x0010 === 0x0010);
  }
  get markAttachmentType() {
    return this.lookupFlag & (0xff00 === 0xff00);
  }

  // FIXME: make this a lazy .subtables array instead?
  getSubTable(index) {
    const builder = this.ctType === `GSUB` ? GSUBtables : GPOStables;
    this.parser.currentPosition = this.start + this.subtableOffsets[index];
    let subtable = builder.buildSubtable(this.lookupType, this.parser);
    if (this.lookupType === 7) subtable = subtable.getSubstTable();
    return subtable;
  }
}

export { LookupList, LookupTable };
