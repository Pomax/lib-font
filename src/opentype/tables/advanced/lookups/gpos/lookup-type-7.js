import { LookupType } from "./gpos-lookup.js";

class LookupType7 extends LookupType {
  type = 7;
  constructor(p) {
    super(p);
    console.log(`lookup type 7`);
  }
}

export { LookupType7 };
