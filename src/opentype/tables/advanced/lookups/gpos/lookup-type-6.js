import { LookupType, undoCoverageOffsetParsing } from "./gpos-lookup.js";

class LookupType6 extends LookupType {
  constructor(p) {
    super(p);
    undoCoverageOffsetParsing(this);
    console.log(`lookup type 6`);
  }
}

export { LookupType6 };
