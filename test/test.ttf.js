import {
    heading,
    indent,
    unindent,
    assertEqual,
    assertNotEqual,
} from "./assert.js";

import { testSFNT } from "./test-SFNT.js";

const font = new Font();

font.onload = () => {

    heading(`Plain TTF tests`);

    unindent(true);
    const SFNT = font.opentype;
    assertNotEqual(SFNT, undefined, `SFNT EXISTS`);
    indent();

    assertEqual(SFNT.version, 0x00010000, `Version is 0x0001.0x0000`);
    assertEqual(SFNT.numTables, 20, `There are 20 tables in this font`);

    const expected = [
        "BASE", "DSIG", "GDEF", "GPOS",
        "GSUB", "OS/2", "SVG ", "cmap",
        "cvt ", "fpgm", "gasp", "glyf",
        "head", "hhea", "hmtx", "loca",
        "maxp", "name", "post", "prep"
    ];
    assertEqual(SFNT.directory.map(d => d.tag), expected, `tables: "${expected.join(`", "`)}"`);

    assertEqual(SFNT.searchRange, 256, `Correct searchRange`);
    assertEqual(SFNT.entrySelector, 4, `Correct entrySelector`);
    assertEqual(SFNT.rangeShift, 64, `Correct rangeShift`);

    testSFNT(SFNT, true);
}

font.src = `../fonts/SourceCodePro-Regular.ttf`;

export { font }
