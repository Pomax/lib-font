import { BitmapSize } from "./shared.js";
import { SimpleTable } from "../../simple-table.js";
import lazy from "../../../../lazy.js";

/**
 * The OpenType `EBLC` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/EBLC
 */
class EBLC extends SimpleTable {
  constructor(dict, dataview, name) {
    const { p } = super(dict, dataview, name);

    this.majorVersion = p.uint16;
    this.minorVersion = p.uint16;
    this.numSizes = p.uint32;

    lazy(this, `bitMapSizes`, () =>
      [...new Array(this.numSizes)].map((_) => new BitmapSize(p))
    );
  }
}

export { EBLC };
