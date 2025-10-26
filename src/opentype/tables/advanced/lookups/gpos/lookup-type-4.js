import { LookupType, undoCoverageOffsetParsing } from "./gpos-lookup.js";

class LookupType4 extends LookupType {
  constructor(p) {
    super(p);
    undoCoverageOffsetParsing(this);
    console.log(`lookup type 4`);
  }
}

export { LookupType4 };
