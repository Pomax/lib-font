import { EBLC } from "./EBLC.js";

/**
 * The OpenType `CBLC` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/CBLC
 */
class CBLC extends EBLC {
  constructor(dict, dataview) {
    super(dict, dataview, `CBLC`);
  }
}

export { CBLC };
