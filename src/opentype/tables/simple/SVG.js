import { ParsedData } from "../../../parser.js";
import { SimpleTable } from "../simple-table.js";
import lazy from "../../../lazy.js";

/**
 * The OpenType `SVG` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/SVG
 */
class SVG extends SimpleTable {
    constructor(dict, dataview) {
        const { p } = super(`SVG`, dict, dataview);

        this.version = uint16;
        this.offsetToSVGDocumentList = p.offset32; // from the start of the SVG table

        p.currentPosition = this.tableStart + this.offsetToSVGDocumentList;
        this.documentList = new SVGDocumentList(p);
    }
}

/**
 * The SVG document list.
 */
class SVGDocumentList extends ParsedData {
    constructor(p) {
        super(p);
        this.numEntries = p.uint16
        this.documentRecords = [...new Array(this.numEntries)].map(_ => new SVGDocumentRecord(p));
    }

    /**
     * Get an SVG document by ID
     */
    getDocument(documentID) {
        let record = this.documentRecords[documentID];
        if (!record) return '';

        let offset = this.start + record.svgDocOffset;
        this.parser.currentPosition = offset;
        return this.parser.readBytes(record.svgDocLength);
    }

    /**
     * Get an SVG document given a glyphID
     */
    getDocumentForGlyph(glyphID) {
        let id = this.documentRecords.findIndex(d =>
            d.startGlyphID <= glyphID && glyphID <= d.endGlyphID
        );
        if (id === -1) return '';
        return this.getDocument(id);
    }
}

/**
 * SVG document record, pointing to a specific SVG document encoding a
 * range of glyphs as <g id="glyph{NUM}>...</g> where {NUM} is a number
 * in the range [startGlyphId, endGlyphId].
 */
class SVGDocumentRecord {
    constructor(p) {
        this.startGlyphID = p.uint16;
        this.endGlyphID = p.uint16;
        this.svgDocOffset = p.offset32; // from the beginning of the SVGDocumentList
        this.svgDocLength = p.uint32;
    }
}

export { SVG };
