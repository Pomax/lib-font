import { LookupType, undoCoverageOffsetParsing } from "./gpos-lookup.js";

class LookupType8 extends LookupType {
  type = 8;
  constructor(p) {
    super(p);
    if (this.format === 3) {
      undoCoverageOffsetParsing(this);
    }
    console.log(`lookup type 8`);
  }
}

export { LookupType8 };
