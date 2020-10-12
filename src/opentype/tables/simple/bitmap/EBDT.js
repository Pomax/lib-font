import { SimpleTable } from "../../simple-table.js";

/**
 * The OpenType `EBDT` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/EBDT
 */
class EBDT extends SimpleTable {
  constructor(dict, dataview, name) {
    const { p } = super(dict, dataview, name);

    this.majorVersion = p.uint16;
    this.minorVersion = p.uint16;
  }

  // TODO: add a way to get the data out
}

export { EBDT };
