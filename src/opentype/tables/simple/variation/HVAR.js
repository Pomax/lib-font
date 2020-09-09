import { SimpleTable } from "../../simple-table.js";

/**
 * The OpenType `HVAR` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/HVAR
 */
class HVAR extends SimpleTable {
  constructor(dict, dataview) {
    const { p } = super(dict, dataview);
  }
}

export { HVAR };
