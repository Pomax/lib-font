import { BitmapScale } from "./shared.js";
import { SimpleTable } from "../../simple-table.js";
import lazy from "../../../../lazy.js";

/**
* The OpenType `EBSC` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/EBSC
*/
class EBSC extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(dict, dataview);

        this.majorVersion = p.uint16;
        this.minorVersion = p.uint16;
        this.numSizes = p.uint32;

        lazy(this, `bitmapScales`, () => [... new Array(this.numSizes)].map(_ => new BitmapScale(p)));
    }
}

export { EBSC };
