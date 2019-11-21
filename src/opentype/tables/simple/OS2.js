import { SimpleTable } from "../simple-table.js";

/**
 * The OpenType `OS/2` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/OS2
 */
class OS2 extends SimpleTable {
    constructor(dict, dataview) {
        const { p } = super(dict, dataview);

        this.version = p.uint16;
        this.xAvgCharWidth = p.int16;
        this.usWeightClass = p.uint16;
        this.usWidthClass = p.uint16;
        this.fsType = p.uint16;
        this.ySubscriptXSize = p.int16;
        this.ySubscriptYSize = p.int16;
        this.ySubscriptXOffset = p.int16;
        this.ySubscriptYOffset = p.int16;
        this.ySuperscriptXSize = p.int16;
        this.ySuperscriptYSize = p.int16;
        this.ySuperscriptXOffset = p.int16;
        this.ySuperscriptYOffset = p.int16;
        this.yStrikeoutSize = p.int16;
        this.yStrikeoutPosition = p.int16;
        this.sFamilyClass = p.int16;
        this.panose = [... new Array(10)].map(_ => p.uint8);
        this.ulUnicodeRange1 = p.flags(32);
        this.ulUnicodeRange2 = p.flags(32);
        this.ulUnicodeRange3 = p.flags(32);
        this.ulUnicodeRange4 = p.flags(32);
        this.achVendID = p.tag;
        this.fsSelection = p.uint16;
        this.usFirstCharIndex = p.uint16;
        this.usLastCharIndex = p.uint16;
        this.sTypoAscender = p.int16;
        this.sTypoDescender = p.int16;
        this.sTypoLineGap = p.int16;
        this.usWinAscent = p.uint16;
        this.usWinDescent = p.uint16;

        if (this.version === 0) return p.verifyLength();

        this.ulCodePageRange1 = p.flags(32);
        this.ulCodePageRange2 = p.flags(32);

        if (this.version === 1) return p.verifyLength();

        this.sxHeight = p.int16;
        this.sCapHeight = p.int16;
        this.usDefaultChar = p.uint16;
        this.usBreakChar = p.uint16;
        this.usMaxContext = p.uint16;

        if (this.version <= 4) return p.verifyLength();

        this.usLowerOpticalPointSize = p.uint16;
        this.usUpperOpticalPointSize = p.uint16;

        if (this.version === 5) return p.verifyLength();
    }
}

export { OS2 };
