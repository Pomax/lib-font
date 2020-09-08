import { SimpleTable } from "../../simple-table.js";
import lazy from "../../../../lazy.js";

/**
 * The OpenType `fvar` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/fvar
 */
class fvar extends SimpleTable {
    constructor(dict, dataview) {
        const { p } = super(dict, dataview);

        this.majorVersion = p.uint16;
        this.minorVersion = p.uint16;
        this.axesArrayOffset = p.offset16;
        p.uint16;
        this.axisCount = p.uint16;
        this.axisSize = p.uint16;
        this.instanceCount = p.uint16;
        this.instanceSize = p.uint16;

        const axisStart = this.tableStart + this.axesArrayOffset;
        lazy(this, `axes`, () => {
            p.currentPosition = axisStart;
            return [... new Array(this.axisCount)].map(_ =>  new VariationAxisRecord(p));
        });

        const instanceStart = axisStart + this.axisCount * this.axisSize;
        lazy(this, `instances`, () => {
            let instances = [];
            for(let i = 0; i<this.instanceCount; i++) {
                p.currentPosition = instanceStart + i * this.instanceSize;
                instances.push(new InstanceRecord(p, this.axisCount));
            }
            return instances;
        });
    }

    getSupportedAxes() {
        return (this.axes).map(a => a.tag);
    }

    getAxis(name) {
        return (this.axes).find(a => a.tag === name);
    }
}

class VariationAxisRecord {
    constructor(p) {
        this.tag = p.tag;
        this.minValue = p.fixed;
        this.defaultValue = p.fixed;
        this.maxValue = p.fixed;
        this.flags = p.flags(16);
        this.axisNameID = p.uint16;
    }
}

class InstanceRecord {
    constructor(p, axisCount) {
        this.subfamilyNameID = p.uint16;
        p.uint16;
        this.coordinates = [...new Array(axisCount)].map(_ => p.fixed);
        this.postScriptNameID = p.uint16;
    }
}

export { fvar };
