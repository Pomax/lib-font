import { Parser } from "../../parser.js";
import lazy from "../../lazy.js";

/**
* The OpenType `hmtx` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/hmtx
*/
class hmtx {
    constructor(tables, dict, dataview) {
        const numberOfHMetrics = tables.hhea.numberOfHMetrics;
        const numGlyphs = tables.maxp.numGlyphs;

        const p = new Parser(`head`, dict, dataview);
        const hMetricGetter = () => [...new Array(numberOfHMetrics)].map(_ => new LongHorMetric(p.uint16, p.int16));
        lazy(this, `hMetrics`, hMetricGetter);

        if (numberOfHMetrics < numGlyphs) {
            const lsbGetter = () => [...new Array(numGlyphs - numberOfHMetrics)].map(_ => p.int16);
            lazy(this, `leftSideBearings`, lsbGetter);
        }
    }
}

class LongHorMetric {
    constructor(w, b) {
        this.advanceWidth = w;
        this.lsb = b;
    }
}

export { hmtx };
