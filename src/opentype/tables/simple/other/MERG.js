import { SimpleTable } from "../../simple-table.js";
import lazy from "../../../../lazy.js";

/**
 * The OpenType `MERG` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/MERG
 */
class MERG extends SimpleTable {
  constructor(dict, dataview) {
    const { p } = super(dict, dataview);
    this.version = p.uint16;
    this.mergeClassCount = p.uint16;
    this.mergeDataOffset = p.Offset16; // from... where?
    this.classDefCount = p.uint16;
    this.offsetToClassDefOffsets = p.Offset16; // from the start of the MERG table.

    // This is a big 2D array
    lazy(this, `mergeEntryMatrix`, () =>
      [...new Array(this.mergeClassCount)].map((_) =>
        p.readBytes(this.mergeClassCount)
      )
    );

    console.warn(`Full MERG parsing is currently not supported.`);
    console.warn(
      `If you need this table parsed, please file an issue, or better yet, a PR.`
    );
  }
}

export { MERG };
