import { LookupType } from "./gpos-lookup.js";

class LookupType8 extends LookupType {
  constructor(p) {
    super(p);
    console.log(`lookup type 8`);
  }
}

export { LookupType8 };
