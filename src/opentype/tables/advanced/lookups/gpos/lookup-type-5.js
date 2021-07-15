import { LookupType } from "./gpos-lookup.js";

class LookupType5 extends LookupType {
  constructor(p) {
    super(p);
    console.log(`lookup type 5`);
  }
}

export { LookupType5 };
