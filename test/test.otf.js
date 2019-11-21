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

    heading(`Plain OTF tests`);

    unindent(true);
    const SFNT = font.opentype;
    assertNotEqual(SFNT, undefined, `SFNT EXISTS`);
    indent();

    {
        assertEqual(SFNT.version, 1330926671, `Version is OTTO`);
        assertEqual(SFNT.numTables, 15, `There are 15 tables in this font`);
        assertEqual(SFNT.searchRange, 128, `Correct searchRange`);
        assertEqual(SFNT.entrySelector, 3, `Correct entrySelector`);
        assertEqual(SFNT.rangeShift, 112, `Correct rangeShift`);
    }

    testSFNT(SFNT);
}

font.src = `../fonts/SourceCodePro-Regular.otf`;

export { font }
