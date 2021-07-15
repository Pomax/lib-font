import { LookupType } from "./gsub-lookup.js";

export class LookupType1 extends LookupType {
  constructor(p) {
    super(p);
    this.deltaGlyphID = p.int16;
  }
}
