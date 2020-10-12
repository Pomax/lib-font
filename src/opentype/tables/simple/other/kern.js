import { SimpleTable } from "../../simple-table.js";
import lazy from "../../../../lazy.js";

/**
 * The OpenType `kern` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/kern
 *
 * Also don't use this table anymore =(
 */
class kern extends SimpleTable {
  constructor(dict, dataview) {
    const { p } = super(dict, dataview);
    this.version = p.uint16;
    this.nTables = p.uint16;

    // getting this data is hilarious, because I'm intentionally not implementing subtable 2
    lazy(this, `tables`, () => {
      let offset = this.tableStart + 4;
      const tables = [];
      for (let i = 0; i < this.nTables; i++) {
        p.currentPosition = offset;
        let subtable = new KernSubTable(p);
        tables.push(subtable);
        offset += subtable;
      }
      return tables;
    });
  }
}

class KernSubTable {
  constructor(p) {
    this.version = p.uint16;
    this.length = p.uint16; // length of subtable (including the header)

    // We deviate from the spec here, because it's ridiculous.
    // The spec says we have a uin16 that represents 16 bits.
    // Then you read the description of how to treat those bits,
    // and you realise it's NOT 16 bits, it's 8 bits of which
    // bits 0-3 are used, and bits 4-7 are reserved, and then it's
    // a plain uint8 "format" value. So that's what we do here.
    this.coverage = p.flags(8);
    this.format = p.uint8;

    if (this.format === 0) {
      this.nPairs = p.uint16;
      this.searchRange = p.uint16;
      this.entrySelector = p.uint16;
      this.rangeShift = p.uint16;
      lazy(this, `pairs`, () =>
        [...new Array(this.nPairs)].map((_) => new Pair(p))
      );
    }

    if (this.format === 2) {
      // Wow. Not only does this font have a kern table, it has a kern table that isn't universally supported. Classy.
      console.warn(
        `Kern subtable format 2 is not supported: this parser currently only parses universal table data.`
      );
    }
  }

  get horizontal() {
    return this.coverage[0];
  }
  get minimum() {
    return this.coverage[1];
  }
  get crossstream() {
    return this.coverage[2];
  }
  get override() {
    return this.coverage[3];
  }
}

class Pair {
  constructor(p) {
    this.left = p.uint16;
    this.right = p.uint16;
    this.value = p.fword;
  }
}

export { kern };
