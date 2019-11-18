import {
    indent,
    unindent,
    assertEqual,
    assertNotEqual,
 } from "./assert.js";

const font = new Font();

font.onload = () => {

    unindent(true);
    const SFNT = font.opentype;
    assertNotEqual(SFNT, undefined, "SFNT EXISTS");

    indent();
    assertEqual(SFNT.version, 1330926671, "Version is OTTO");
    assertEqual(SFNT.numTables, 15, "There are 15 tables in this font");
    assertEqual(SFNT.searchRange, 128, "Correct searchRange");
    assertEqual(SFNT.entrySelector, 3, "Correct entrySelector");
    assertEqual(SFNT.rangeShift, 112, "Correct rangeShift");

    // Table tests

    const tables = SFNT.tables;

    // head table

    unindent(true);
    const head = tables.head;
    assertNotEqual(head, undefined, `head EXISTS`);
    indent();

    assertEqual(head.magicNumber, 1594834165, "Correct OpenType magic number");
    assertEqual(head.fontDirectionHint, 2, "Correct (obsolete) fontDirectionHint value");
    assertEqual(head.unitsPerEm, 1000, "1000 font units to a quad");
    assertEqual(head.xMin, -193, "Correct bbox xMin");
    assertEqual(head.xMax,  793, "Correct bbox xMax");
    assertEqual(head.yMin, -454, "Correct bbox yMin");
    assertEqual(head.yMax, 1060, "Correct bbox yMax");

    // cmap table
    unindent(true);
    const cmap = tables.cmap;
    assertNotEqual(cmap, undefined, `cmap EXISTS`);
    indent();

    {
        assertEqual(cmap.encodingRecords.length, 6, "There are 6 cmap subtables");
        indent();
        assertEqual([
            cmap.encodingRecords[0].platformID,
            cmap.encodingRecords[0].encodingID
        ], [0, 3], "1 = Unicode: BMP");
        assertEqual([
            cmap.encodingRecords[1].platformID,
            cmap.encodingRecords[1].encodingID
        ], [0, 4], "2 = Unicode: Full repetoire");
        assertEqual([
            cmap.encodingRecords[2].platformID,
            cmap.encodingRecords[2].encodingID
        ], [0, 5], "3 = Unicode: Variation Sequences");
        assertEqual([
            cmap.encodingRecords[3].platformID,
            cmap.encodingRecords[3].encodingID,
        ], [1, 0], "4 = Macintosh: Roman");
        assertEqual([
            cmap.encodingRecords[4].platformID,
            cmap.encodingRecords[4].encodingID,
         ], [3, 1], "5 = Windows: Unicode BMP");
        assertEqual([
            cmap.encodingRecords[5].platformID,
            cmap.encodingRecords[5].encodingID,
        ], [3,10], "6 = Windows: Unicode full repertoire");
        unindent();

        let subtable = cmap.get(0);
        assertEqual(subtable.format, 4, "First subtable is format 4.");

        function testFormat4(subtable) {
            assertEqual(subtable.segCountX2, 438, "Subtable encodes 219 segments.");
            let segment = subtable.segments[0];
            assertEqual(segment.start, 32, "First segment starts on char 32.");
            assertEqual(segment.end, 47, "First segment ends on char 47");
            assertEqual(segment.idDelta, 0, "Segment has zero delta");
            assertEqual(segment.idRangeOffset, 438, "Segment has a range offset of 438");
        }

        indent();
        testFormat4(subtable);
        unindent();

        subtable = cmap.get(1);
        assertEqual(subtable.format, 12, "Second subtable is format 12.");

        function testFormat12() {
            assertEqual(subtable.numGroups, 774, "Subtable encodes 774 groups.");
            assertEqual(subtable.groups.length, subtable.numGroups, "Data indeed resolves to 774 groups.");
            let group = subtable.groups[0];
            assertEqual(group.startGlyphID, 1, "First group's first glyph ID is 1.");
            assertEqual(group.startCharCode, 32, "First group starts on char 32.");
            assertEqual(group.endCharCode, 32, "First group ends with char 32.");
        }

        indent();
        testFormat12(subtable);
        unindent();

        subtable = cmap.get(2);
        assertEqual(subtable.format, 14, "Third subtable is format 14.");
        indent();
        assertEqual(subtable.numVarSelectorRecords, 1, "Subtable has a single variation selector record.");
        assertEqual(subtable.varSelectors.length, 1, "Data indeed resolves to a single variation selector record.");
        unindent();

        subtable = cmap.get(3);
        assertEqual(subtable.format, 6, "Fourth subtable is format 6.");
        indent();
        assertEqual(subtable.entryCount, 247, "Subtable has 247 entries.");
        assertEqual(subtable.glyphIdArray.length, 247, "Data indeed resolves to 247 glyph IDs.");
        unindent();

        subtable = cmap.get(4);
        assertEqual(subtable.format, 4, "Fifth subtable is format 4, and should be the same as the first subtable.");
        indent();
        testFormat4(subtable);
        unindent();

        subtable = cmap.get(5);
        assertEqual(subtable.format, 12, "Sixth subtable is format 12, and should be the same as the second subtable.");
        indent();
        testFormat12(subtable);
        unindent();
    }

    // GPOS table
    unindent(true);
    const GPOS = tables.GPOS;
    assertNotEqual(GPOS, undefined, `GPOS EXISTS`);
    indent();

    {
        const scripts = GPOS.getSupportedScripts();
        assertEqual(scripts, ["DFLT", "cyrl", "grek", "latn"], "Four supported scripts.");
        const latn = GPOS.getScriptTable("latn");
        const ls = GPOS.getSupportedLangSys(latn);
        assertEqual(ls, ["ATH ","NSM ","SKS "], "Script 'latn' has three lang sys entries.");
        const langsys = GPOS.getLangSysTable(latn, "NSM ");
        const features = GPOS.getFeatures(langsys);
        assertEqual(features.length, 5, "Northern Sami supports 5 OpenType features.")
        const tags = features.map(f => f.featureTag);
        const expected = ["ccmp", "frac", "mark", "mkmk", "size"];
        assertEqual(tags, expected, `Supported features: ${expected.join(', ')}`);
    }

    // GSUB table
    unindent(true);
    const GSUB = tables.GSUB;
    assertNotEqual(GSUB, undefined, `GSUB EXISTS`);
    indent();

    {
        const scripts = GSUB.getSupportedScripts();
        assertEqual(scripts, ["DFLT", "cyrl", "grek", "latn"], "Four supported scripts.");
        const latn = GSUB.getScriptTable("latn");
        const ls = GSUB.getSupportedLangSys(latn);
        assertEqual(ls, ["ATH ","NSM ","SKS "], "Script 'latn' has three lang sys entries.");
        const langsys = GSUB.getLangSysTable(latn, "NSM ");
        const features = GSUB.getFeatures(langsys);
        assertEqual(features.length, 34, "Northern Sami supports 34 OpenType features.")
        const tags = features.map(f => f.featureTag);
        const expected = [
            "case","ccmp","cv01","cv02","cv04","cv06","cv07","cv08","cv09","cv10",
            "cv11","cv12","cv14","cv15","cv16","cv17","dnom","frac","locl","numr",
            "onum","ordn","salt","sinf","ss01","ss02","ss03","ss04","ss05","ss06",
            "ss07","subs","sups","zero"
        ];
        assertEqual(tags, expected, `Supported features: ${expected.join(', ')}`);
    }
}

font.src = `../fonts/SourceCodePro-Regular.otf`;
