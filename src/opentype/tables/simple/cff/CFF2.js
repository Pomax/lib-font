import { SimpleTable } from "../../simple-table.js";
import lazy from "../../../../lazy.js";

/**
 * The OpenType `CFF2` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/CFF2
 */
class CFF2 extends SimpleTable {
  constructor(dict, dataview) {
    const { p } = super(dict, dataview);
    lazy(this, `data`, () => p.readBytes());
  }
}

export { CFF2 };
