import { ParsedData } from "../../../../../parser.js";
import { LookupType } from "./gsub-lookup.js";

export class LookupType4 extends LookupType {
  constructor(p) {
    super(p);
    this.ligatureSetCount = p.uint16;
    this.ligatureSetOffsets = [...new Array(this.ligatureSetCount)].map(
      (_) => p.Offset16
    ); // from beginning of subtable
  }
  getLigatureSet(index) {
    let p = this.parser;
    p.currentPosition = this.start + this.ligatureSetOffsets[index];
    return new LigatureSetTable(p);
  }
}

class LigatureSetTable extends ParsedData {
  constructor(p) {
    super(p);
    this.ligatureCount = p.uint16;
    this.ligatureOffsets = [...new Array(this.ligatureCount)].map(
      (_) => p.Offset16
    ); // from beginning of LigatureSetTable
  }
  getLigature(index) {
    let p = this.parser;
    p.currentPosition = this.start + this.ligatureOffsets[index];
    return new LigatureTable(p);
  }
}

class LigatureTable {
  constructor(p) {
    this.ligatureGlyph = p.uint16;
    this.componentCount = p.uint16;
    this.componentGlyphIDs = [...new Array(this.componentCount - 1)].map(
      (_) => p.uint16
    );
  }
}
