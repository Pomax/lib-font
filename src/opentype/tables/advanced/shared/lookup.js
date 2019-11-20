import { ParsedData } from "../../../../parser.js";

class LookupList extends ParsedData {
    constructor(p) {
        super(p);
        this.lookupCount = p.uint16;
        this.lookups = [...new Array(this.lookupCount)].map(_ => p.offset16); // Array of offsets to Lookup tables, from beginning of LookupList
    }
}

class LookupTable extends ParsedData {
    constructor(p) {
        super(p);
        this.lookupType = p.uint16;
        this.lookupFlag = p.uint16;
        this.subTableCount = p.uint16;
        this.subtableOffsets = [...new Array(this.subTableCount)].map(_ => p.offset16) // Array of offsets to lookup subtables, from beginning of Lookup table
        this.markFilteringSet = p.uint16;
    }
    get rightToLeft() {
        return this.lookupFlag & 0x0001 === 0x0001;
    }
    get ignoreBaseGlyphs() {
        return this.lookupFlag & 0x0002 === 0x0002;
    }
    get ignoreLigatures() {
        return this.lookupFlag & 0x0004 === 0x0004;
    }
    get ignoreMarks() {
        return this.lookupFlag & 0x0008 === 0x0008;
    }
    get useMarkFilteringSet() {
        return this.lookupFlag & 0x0010 === 0x0010;
    }
    get markAttachmentType() {
        return this.lookupFlag & 0xFF00 === 0xFF00;
    }

    getSubTables() {
        return this.subtableOffsets.map(offset => {
            this.parser.currentPosition = this.start + offset;
            return new CoverageTable(this.parser);
        });
    }
}

class CoverageTable extends ParsedData {
    constructor(p) {
        super(p);

        this.coverageFormat = p.uint16;

        if (this.coverageFormat === 1) {
            this.glyphCount = p.uint16;
            this.glyphArray = [...new Array(this.glyphCount)].map(_ => p.uint16);
        }

        if (this.coverageFormat === 2) {
            this.rangeCount = p.uint16;
            this.rangeRecords = [...new Array(this.rangeCount)].map(_ => new CoverageRangeRecord(p));
        }
    }
}

class CoverageRangeRecord {
    constructor(p) {
        this.startGlyphID = p.uint16;
        this.endGlyphID = p.uint16;
        this.startCoverageIndex = p.uint16;
    }
}

export { LookupList, LookupTable };
