import { SimpleTable } from "../../simple-table.js";

/**
 * The OpenType `gvar` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/gvar
 */
class gvar extends SimpleTable {
  constructor(dict, dataview) {
    const { p } = super(dict, dataview);
  }
}

export { gvar };
