import { LookupType } from "./gpos-lookup.js";

class LookupType2 extends LookupType {
  type = 2;
  constructor(p) {
    super(p);
    console.log(`lookup type 2`);
  }
}

export { LookupType2 };
