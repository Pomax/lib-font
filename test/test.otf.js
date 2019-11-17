import { assertEqual, assertNotEqual } from "./assert.js";

const font = new Font();

font.onload = () => {

    const SFNT = font.opentype;
    assertNotEqual(SFNT, undefined, "SFNT EXISTS");

    assertEqual(SFNT.version, 1330926671, "version is OTTO");
    assertEqual(SFNT.numTables, 15, "There are 15 tables in this font");
    assertEqual(SFNT.searchRange, 128, "correct searchRange");
    assertEqual(SFNT.entrySelector, 3, "correct entrySelector");
    assertEqual(SFNT.rangeShift, 112, "correct rangeShift");

    // Table tests

    const tables = SFNT.tables;

    // head table

    const head = tables.head;
    assertNotEqual(head, undefined, `head EXISTS`);

    assertEqual(head.magicNumber, 1594834165, "correct OpenType magic number");
    assertEqual(head.fontDirectionHint, 2, "correct (obsolete) fontDirectionHint value");
    assertEqual(head.unitsPerEm, 1000, "1000 font units to a quad");
    assertEqual(head.xMin, -193, "correct bbox xMin");
    assertEqual(head.xMax,  793, "correct bbox xMax");
    assertEqual(head.yMin, -454, "correct bbox yMin");
    assertEqual(head.yMax, 1060, "correct bbox yMax");

    // GPOS table

    const GPOS = tables.GPOS;
    assertNotEqual(GPOS, undefined, `GPOS EXISTS`);

    {
        const scripts = GPOS.getSupportedScripts();
        assertEqual(scripts, ["DFLT", "cyrl", "grek", "latn"], "Four supported scripts");
        const latn = GPOS.getScriptTable("latn");
        const ls = GPOS.getSupportedLangSys(latn);
        assertEqual(ls, ["ATH ","NSM ","SKS "], "Script 'latn' has three lang sys entries");
        const langsys = GPOS.getLangSysTable(latn, "NSM ");
        const features = GPOS.getFeatures(langsys);
        assertEqual(features.length, 5, "Northern Sami supports 5 OpenType features")
        const tags = features.map(f => f.featureTag);
        const expected = ["ccmp", "frac", "mark", "mkmk", "size"];
        assertEqual(tags, expected, `Supported features: ${expected.join(', ')}`);
    }

    // GSUB table

    const GSUB = tables.GSUB;
    assertNotEqual(GSUB, undefined, `GSUB EXISTS`);
    {
        const scripts = GSUB.getSupportedScripts();
        assertEqual(scripts, ["DFLT", "cyrl", "grek", "latn"], "Four supported scripts");
        const latn = GSUB.getScriptTable("latn");
        const ls = GSUB.getSupportedLangSys(latn);
        assertEqual(ls, ["ATH ","NSM ","SKS "], "Script 'latn' has three lang sys entries");
        const langsys = GSUB.getLangSysTable(latn, "NSM ");
        const features = GSUB.getFeatures(langsys);
        assertEqual(features.length, 34, "Northern Sami supports 34 OpenType features")
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
