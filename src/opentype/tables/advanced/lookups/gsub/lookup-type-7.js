import { LookupType, undoCoverageOffsetParsing } from "./gsub-lookup.js";

import { LookupType1 } from "./lookup-type-1.js";
import { LookupType2 } from "./lookup-type-2.js";
import { LookupType3 } from "./lookup-type-3.js";
import { LookupType4 } from "./lookup-type-4.js";
import { LookupType5 } from "./lookup-type-5.js";
import { LookupType6 } from "./lookup-type-6.js";
import { LookupType8 } from "./lookup-type-8.js";

// This subtable is the "I actually need a 32 bit
// offset" hack table that is used as a pointer to
// any of the other subtables that can't be pointed
// to using a 16 bit offset value.
class LookupType7 extends LookupType {
  type = 7;
  constructor(p) {
    super(p);
    // undo the coverageOffset parsing, because this subtable
    // "isn't a table", it's just a pointer to another table.
    undoCoverageOffsetParsing(this);
    this.extensionLookupType = p.uint16;
    this.extensionOffset = p.Offset32; // from beginning of subtable
  }
  getSubstTable() {
    if (this._lookup === undefined) {
      const p = this.parser;
      const type = this.extensionLookupType;
      let LookupType;
      if (type === 1) LookupType = LookupType1;
      if (type === 2) LookupType = LookupType2;
      if (type === 3) LookupType = LookupType3;
      if (type === 4) LookupType = LookupType4;
      if (type === 5) LookupType = LookupType5;
      if (type === 6) LookupType = LookupType6;
      if (type === 8) LookupType = LookupType8;
      if (LookupType) {
        p.currentPosition = this.start + this.extensionOffset;
        this._lookup = new LookupType(p);
      } else {
        this._lookup = false;
      }
    }

    return this._lookup;
  }
}

export { LookupType7 };
