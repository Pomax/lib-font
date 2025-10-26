import { LookupType, undoCoverageOffsetParsing } from "./gpos-lookup.js";

class LookupType9 extends LookupType {
  constructor(p) {
    super(p);
    undoCoverageOffsetParsing(this);
    console.log(`lookup type 9`);
  }
}

export { LookupType9 };
