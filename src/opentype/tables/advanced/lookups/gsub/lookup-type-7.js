import { LookupType, undoCoverageOffsetParsing } from "./gsub-lookup.js";

import { LookupType1 } from "./lookup-type-1.js";
import { LookupType2 } from "./lookup-type-2.js";
import { LookupType3 } from "./lookup-type-3.js";
import { LookupType4 } from "./lookup-type-4.js";
import { LookupType5 } from "./lookup-type-5.js";
import { LookupType6 } from "./lookup-type-6.js";
import { LookupType8 } from "./lookup-type-8.js";

const Lookups = [
  null,
  LookupType1,
  LookupType2,
  LookupType3,
  LookupType4,
  LookupType5,
  LookupType6,
  null,
  LookupType8,
];

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
      let LookupType = Lookups[type];
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
