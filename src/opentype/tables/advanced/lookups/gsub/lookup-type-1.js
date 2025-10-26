import { LookupType } from "./gsub-lookup.js";

class LookupType1 extends LookupType {
  type = 1;
  constructor(p) {
    super(p);
    this.deltaGlyphID = p.int16;
  }
}

export { LookupType1 };
