import { LookupType, undoCoverageOffsetParsing } from "./gpos-lookup.js";

class LookupType5 extends LookupType {
  constructor(p) {
    super(p);
    undoCoverageOffsetParsing(this);
    console.log(`lookup type 5`);
  }
}

export { LookupType5 };
