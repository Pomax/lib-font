import { SimpleTable } from "../../simple-table.js";

/**
 * The OpenType `MVAR` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/MVAR
 */
class MVAR extends SimpleTable {
  constructor(dict, dataview) {
    const { p } = super(dict, dataview);
  }
}

export { MVAR };
