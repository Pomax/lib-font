import { SimpleTable } from "../simple-table.js";

/**
* The OpenType `post` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/post
*/
class post extends SimpleTable {
    constructor(dict, dataview) {
        const { p } = super(dict, dataview);

        this.version = p.legacyFixed;
        this.italicAngle = p.fixed;
        this.underlinePosition = p.fword;
        this.underlineThickness = p.fword;
        this.isFixedPitch = p.uint32;
        this.minMemType42 = p.uint32;
        this.maxMemType42 = p.uint32;
        this.minMemType1 = p.uint32;
        this.maxMemType1 = p.uint32;

        if (this.version === 1 || this.version === 3) return p.verifyLength();

        this.numGlyphs = p.uint16;

        if (this.version === 2) {
            this.glyphNameIndex = [...new Array(this.numGlyphs)].map(_ => p.uint16);
            // And then we get:
            //
            //   names = int8[numberNewGlyphs]
            //   Glyph names with length bytes [variable] (a Pascal string)
            //
            // and the full description is not worth my time trying to figure out right now.
            //
            // TODO: get someone to implement that >_>
        }

        if (this.version === 2.5) {
            this.offset = [...new Array(this.numGlyphs)].map(_ => p.int8);
        }
    }
}

export { post };
