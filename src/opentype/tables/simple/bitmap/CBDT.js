import { EBDT } from "./EBDT.js";

/**
 * The OpenType `CBDT` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/CBDT
 */
class CBDT extends EBDT {
  constructor(dict, dataview) {
    super(dict, dataview, `CBDT`);
  }

  // TODO: In addition to nine different formats already defined for glyph bitmap data in the EBDT table, there are three more formats
}

export { CBDT };
