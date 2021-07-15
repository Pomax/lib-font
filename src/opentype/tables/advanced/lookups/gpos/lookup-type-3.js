import { LookupType } from "./gpos-lookup.js";

class LookupType3 extends LookupType {
  constructor(p) {
    super(p);
    console.log(`lookup type 3`);
  }
}

export { LookupType3 };
