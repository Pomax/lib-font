import lazy from "../../../../lazy.js";
import { ParsedData } from "../../../../parser.js";

class Format4 {
    constructor(p) {
        this.format = 4;
        this.length = p.uint16;
        this.language = p.uint16;
        this.segCountX2 = p.uint16;
        this.searchRange = p.uint16;
        this.entrySelector = p.uint16;
        this.rangeShift = p.uint16;

        // This cmap subformat basically lazy-loads everything. It would be better to
        // not even lazy load but the code is not ready for selective extraction.

        const endCodeOffset = p.currentPosition;
        lazy(this, `endCode`, () => p.readBytes(this.segCountX2, endCodeOffset, 16));

        const startCodeOffset = endCodeOffset + 2 + this.segCountX2;
        lazy(this, `startCode`, () => p.readBytes(this.segCountX2, startCodeOffset, 16));

        const idDeltaOffset = startCodeOffset +  this.segCountX2;
        lazy(this, `idDelta`, () => p.readBytes(this.segCountX2, idDeltaOffset, 16));

        const idRangeOffset = idDeltaOffset + this.segCountX2;
        lazy(this, `idRangeOffset`, () => p.readBytes(this.segCountX2, idRangeOffset, 16));

        const glyphIdArrayOffset = idRangeOffset + this.segCountX2;
        const glyphIdArrayLength = this.length - (glyphIdArrayOffset - this.tableStart);
        lazy(this, `glyphIdArray`, () => p.readBytes(glyphIdArrayLength, glyphIdArrayOffset, 16));

        // also, while not in the spec, we really want to organise all that data into convenient segments
        lazy(this, `segments`, () => this.buildSegments());
    }

    buildSegments() {
        const build = (_,i) => ({
            startCode: this.startCode[i],
            endCode: this.endCode[i],
            idDelta: this.idDelta[i],
            idRangeOffset: this.idRangeOffset[i]
        });
        return  [...new Array(this.segCountX2/2)].map(build);
    }

    supports(charCode) {
        if (charCode.charCodeAt) charCode = charCode.charCodeAt(0);
        return this.segments.findIndex(s => s.startCode <= charCode && charCode <= s.endCode) !== -1
    }

    getSupportedCharCodes(preservePropNames=false) {
        if (preservePropNames) return this.segments;
        return this.segments.map(v => ({ start: v.startCode, end: v.endCode}));
    }
}

export { Format4 };
