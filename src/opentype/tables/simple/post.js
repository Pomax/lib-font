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
        console.warn(`A post table version 2.x is not currently supported, because they're just weird.`);
    }
}

export { post };
