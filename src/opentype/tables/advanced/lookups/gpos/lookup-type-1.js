import { LookupType } from "./gpos-lookup.js";

class LookupType1 extends LookupType {
  type = 1;
  constructor(p) {
    super(p);
    console.log(`lookup type 1`);
  }
}

export { LookupType1 };
