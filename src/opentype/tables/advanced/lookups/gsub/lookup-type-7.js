import { ParsedData } from "../../../../../parser.js";

class LookupType7 extends ParsedData {
  // note: not "extends LookupType"
  constructor(p) {
    super(p);
    this.substFormat = p.uint16;
    this.extensionLookupType = p.uint16;
    this.extensionOffset = p.Offset32;
  }
}

export { LookupType7 };
