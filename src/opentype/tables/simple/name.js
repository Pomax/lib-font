import { Parser } from "../../../parser.js";
import { SimpleTable } from "../simple-table.js";

/**
* The OpenType `name` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/name
*/
class name extends SimpleTable {
    constructor(dict, dataview) {
        const { p } = super(dict, dataview);

        this.format = p.uint16;
        this.count = p.uint16;
        this.stringOffset = p.offset16; // relative to start of table

        // name records
        this.nameRecords = [...new Array(this.count)].map((_,i) => new NameRecord(p));

        // lang-tag records, if applicable
        if (this.format === 1) {
            this.langTagCount = p.uint16;
            this.langTagRecords = [...new Array(this.langTagCount)].map(_ => new LangTagRecord(p.uint16, p.offset16));
        }

        // cache these values for use in `.get(nameID)`
        this.stringStart = this.tableStart + this.stringOffset;
    }

    /**
     * Resolve a string by ID
     * @param {uint16} nameID the id used to find the name record to resolve.
     */
    get(nameID) {
        let record = this.nameRecords.find(record => record.nameID === nameID);
        if (record) {
            const dict = { offset: this.stringStart + record.offset };
            const p = new Parser(dict, this.parser.data, `Name record ${nameID}`);
            const bytes = new Uint8Array(p.readBytes(record.length));
            return [...bytes].map(v => String.fromCharCode(v)).join(``);
        }
    }
}

/**
 * ...docs go here...
 */
class LangTagRecord {
    constructor(length, offset) {
        this.length = length;
        this.offset = offset;
    }
}

/**
 * ...docs go here...
 */
class NameRecord {
    constructor(p) {
        this.platformID = p.uint16;
        this.encodingID = p.uint16;
        this.languageID = p.uint16;
        this.nameID = p.uint16;
        this.length = p.uint16;
        this.offset = p.offset16;
    }
}

export { name };
