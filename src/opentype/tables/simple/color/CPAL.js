import { SimpleTable } from "../../simple-table.js";
import lazy from "../../../../lazy.js";

/**
 * The OpenType `CPAL` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/CPAL
 */
class CPAL extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(dict, dataview);

        this.version = p.uint16;
        this.numPaletteEntries = p.uint16;
        const numPalettes = this.numPalettes = p.uint16;
        this.numColorRecords = p.uint16;
        this.offsetFirstColorRecord = p.offset32;
        this.colorRecordIndices = [... new Array(this.numPalettes)].map(_ => p.uint16);

        lazy(this, `colorRecords`, () => {
            p.currentPosition = this.startTable + this.offsetFirstColorRecord;
            return [...new Array(this.numColorRecords)].map(_ => new ColorRecord(p));
        });

        // Index of each palette’s first color record in the combined color record array.

        if (this.version === 1) {
            this.offsetPaletteTypeArray = p.offset32; // from the beginning of CPAL table to the Palette Type Array.
            this.offsetPaletteLabelArray = p.offset32; // from the beginning of CPAL table to the Palette Labels Array.
            this.offsetPaletteEntryLabelArray = p.offset32; // from the beginning of CPAL table to the Palette Entry Label Array.

            lazy(this, `paletteTypeArray`, () => {
                p.currentPosition = this.startTable + this.offsetPaletteTypeArray;
                return new PaletteTypeArray(p, numPalettes);
            });

            lazy(this, `paletteLabelArray`, () => {
                p.currentPosition = this.startTable + this.offsetPaletteLabelArray;
                return new PaletteLabelsArray(p, numPalettes);
            });

            lazy(this, `paletteEntryLabelArray`, () => {
                p.currentPosition = this.startTable + this.offsetPaletteEntryLabelArray;
                return new PaletteEntryLabelArray(p, numPalettes);
            });
        }
    }
}

class ColorRecord {
    constructor(p) {
        this.blue = p.uint8;
        this.green = p.uint8;
        this.red = p.uint8;
        this.alpha = p.uint8;
    }
}

class PaletteTypeArray {
    constructor(p, numPalettes) {
        // see https://docs.microsoft.com/en-us/typography/opentype/spec/cpal#palette-type-array
        this.paletteTypes = [...new Array(numPalettes)].map(_ => p.uint32);
    }
}

class PaletteLabelsArray {
    constructor(p, numPalettes) {
        // see https://docs.microsoft.com/en-us/typography/opentype/spec/cpal#palette-labels-array
        this.paletteLabels = [...new Array(numPalettes)].map(_ => p.uint16);
    }
}

class PaletteEntryLabelArray {
    constructor(p, numPalettes) {
        // see https://docs.microsoft.com/en-us/typography/opentype/spec/cpal#palette-entry-label-array
        this.paletteEntryLabels = [...new Array(numPalettes)].map(_ => p.uint16);
    }
}


export { CPAL };
