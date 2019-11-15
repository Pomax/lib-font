import { Parser } from "../../../parser.js";
import { ScriptList } from "./script.js";
import { FeatureList } from "./feature.js";
import { LookupList } from "./lookup.js";
import lazy from "../../../lazy.js";

/**
* The OpenType `GSUB` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/GSUB
*/
class GSUB {
    constructor(dict, dataview) {
        const p = new Parser(`GSUB`, dict, dataview);
        const tableStart = p.currentPosition;

        this.majorVersion = p.uint16;
        this.minorVersion = p.uint16;
        this.scriptListOffset = p.offset16;
        this.featureListOffset = p.offset16;
        this.lookupListOffset = p.offset16;

        if (this.majorVersion === 1 && this.minorVersion === 1) {
            this.featureVariationsOffset = p.offset32;
        }

        lazy(this, `scriptList`, () => {
            p.currentPosition = tableStart + this.scriptListOffset;
            return new ScriptList(this, p);
        });

        lazy(this, `featureList`, () => {
            p.currentPosition = tableStart + this.featureListOffset;
            return new FeatureList(this, p);
        });

        lazy(this, `lookupList`, () => {
            p.currentPosition = tableStart + this.lookupListOffset;
            return new LookupList(this, p);
        });

        if (this.featureVariationsOffset) {
            lazy(this, `featureVariations`, () => {
                p.currentPosition = tableStart + this.featureVariationsOffset;
                return new FeatureVariations(this, p);
            });
        }
    }
}

export { GSUB };