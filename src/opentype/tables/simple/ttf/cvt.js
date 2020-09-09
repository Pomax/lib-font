import { SimpleTable } from "../../simple-table.js";
import lazy from "../../../../lazy.js";

/**
 * The OpenType `cvt` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/cvt
 */
class cvt extends SimpleTable {
  constructor(dict, dataview) {
    const { p } = super(dict, dataview);
    //
    // The actual data is n instructions, where n is the number of
    // FWORD items that fit in the size of the table. That is:
    //
    //   n = table length / sizeof(int16)
    //     = table length / 2;
    //
    const n = dict.length / 2;
    lazy(this, `items`, () => [...new Array(n)].map((_) => p.fword));
  }
}

export { cvt };
