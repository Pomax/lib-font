// cmap subtables

import { Format0 } from "./format0.js";
import { Format2 } from "./format2.js";
import { Format4 } from "./format4.js";
import { Format6 } from "./format6.js";
import { Format8 } from "./format8.js";
import { Format10 } from "./format10.js";
import { Format12 } from "./format12.js";
import { Format13 } from "./format13.js";
import { Format14 } from "./format14.js";

/**
 * Cmap Subtable factory
 * @param {int} format the subtable format number (see https://docs.microsoft.com/en-us/typography/opentype/spec/cmap#format-0-byte-encoding-table onward)
 * @param {parser} parser a parser already pointing at the subtable's data location, right after reading the `format` uint16.
 */
export default function createSubTable(parser, platformID, encodingID) {
  const format = parser.uint16;
  if (format === 0) return new Format0(parser, platformID, encodingID);
  if (format === 2) return new Format2(parser, platformID, encodingID);
  if (format === 4) return new Format4(parser, platformID, encodingID);
  if (format === 6) return new Format6(parser, platformID, encodingID);
  if (format === 8) return new Format8(parser, platformID, encodingID);
  if (format === 10) return new Format10(parser, platformID, encodingID);
  if (format === 12) return new Format12(parser, platformID, encodingID);
  if (format === 13) return new Format13(parser, platformID, encodingID);
  if (format === 14) return new Format14(parser, platformID, encodingID);
  return {};
}
