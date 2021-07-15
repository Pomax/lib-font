import { LookupType } from "./gpos-lookup.js";

class LookupType9 extends LookupType {
  constructor(p) {
    super(p);
    console.log(`lookup type 9`);
  }
}

export { LookupType9 };
