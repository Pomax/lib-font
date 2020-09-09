import lazy from "../../../lazy.js";
import { SimpleTable } from "../simple-table.js";

/**
 * The OpenType `JSTF` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/JSTF
 */
class JSTF extends SimpleTable {
  constructor(dict, dataview) {
    const { p } = super(dict, dataview);
  }
}

export { JSTF };
