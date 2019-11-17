import { SimpleTable } from "../simple-table.js";

/**
* The OpenType `maxp` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/maxp
*/
class maxp extends SimpleTable {
    constructor(dict, dataview) {
        const { p } = super(`maxp`, dict, dataview);

        this.version = p.legacyFixed;
        this.numGlyphs = p.uint16;

        if (this.version === 1) {
            this.maxPoints = p.uint16;
            this.maxContours = p.uint16;
            this.maxCompositePoints = p.uint16;
            this.maxCompositeContours = p.uint16;
            this.maxZones = p.uint16;
            this.maxTwilightPoints = p.uint16;
            this.maxStorage = p.uint16;
            this.maxFunctionDefs = p.uint16;
            this.maxInstructionDefs = p.uint16;
            this.maxStackElements = p.uint16;
            this.maxSizeOfInstructions = p.uint16;
            this.maxComponentElements = p.uint16;
            this.maxComponentDepth = p.uint16;
        }

        p.verifyLength();
    }
}

export { maxp };
