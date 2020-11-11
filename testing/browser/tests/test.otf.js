import {
  heading,
  indent,
  unindent,
  assertEqual,
  assertNotEqual,
} from "./assert.js";

import { testSFNT } from "./test-SFNT.js";

const name = `Source Code Pro Regular (otf)`;
const font = new Font(name);

font.onload = () => {
  heading(`Plain OTF tests`);

  unindent(true);

  const fontName = font.name;
  assertEqual(fontName, name, `Font object has correct name property`);

  const SFNT = font.opentype;
  assertNotEqual(SFNT, undefined, `SFNT EXISTS`);

  indent();

  assertEqual(SFNT.version, 1330926671, `Version is OTTO`);
  assertEqual(SFNT.numTables, 15, `There are 15 tables in this font`);

  const expected = [
    "BASE",
    "CFF ",
    "DSIG",
    "GDEF",
    "GPOS",
    "GSUB",
    "OS/2",
    "SVG ",
    "cmap",
    "head",
    "hhea",
    "hmtx",
    "maxp",
    "name",
    "post",
  ];

  assertEqual(
    SFNT.directory.map((d) => d.tag),
    expected,
    `tables: "${expected.join(`", "`)}"`
  );

  assertEqual(SFNT.searchRange, 128, `Correct searchRange`);
  assertEqual(SFNT.entrySelector, 3, `Correct entrySelector`);
  assertEqual(SFNT.rangeShift, 112, `Correct rangeShift`);

  testSFNT(SFNT);

  assertEqual(font.supports("a"), true, `font supports the Latin lowercase A`);
  assertEqual(
    font.supports("Ɔ"),
    false,
    `font does not support the Latin capital letter open O`
  );
  assertEqual(
    font.supports("〆"),
    false,
    `font does not support the Japanese EOL marker`
  );

  document.dispatchEvent(
    new CustomEvent(`testend`, { detail: { test: `otf` } })
  );
};

font.src = `../fonts/SourceCodePro/SourceCodePro-Regular.otf`;

export { font };
