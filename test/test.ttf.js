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

    {
        assertEqual(SFNT.version, 0x00010000, `Version is 0x00010000`);
        assertEqual(SFNT.numTables, 20, `There are 15 tables in this font`);
        assertEqual(SFNT.searchRange, 256, `Correct searchRange`);
        assertEqual(SFNT.entrySelector, 4, `Correct entrySelector`);
        assertEqual(SFNT.rangeShift, 64, `Correct rangeShift`);
    }

    testSFNT(SFNT, true);
}

font.src = `../fonts/SourceCodePro-Regular.ttf`;

export { font }
