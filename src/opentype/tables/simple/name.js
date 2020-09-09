import { Parser } from "../../../parser.js";
import { SimpleTable } from "../simple-table.js";
import lazy from "../../../lazy.js";

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
        this.nameRecords = [...new Array(this.count)].map(_ => new NameRecord(p, this));

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
        if (record) return record.string;
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
    constructor(p, nameTable) {
        this.platformID = p.uint16;
        this.encodingID = p.uint16;
        this.languageID = p.uint16;
        this.nameID = p.uint16;
        this.length = p.uint16;
        this.offset = p.offset16;

        lazy(this, `string`, () => {
            const dict = { offset: nameTable.tableStart + nameTable.stringOffset + this.offset };
            const p = new Parser(dict, nameTable.parser.data, `Name record ${this.nameID}`);
            return decodeString(p, this);
        });
    }
}


/**
 * Specific platforms and platform/encoding combinations encode strings in
 * different ways.
 */
function decodeString(p, record) {
    const { nameID, platformID, encodingID, length } = record;

    // We decode strings for the Unicode/Microsoft platforms as UTF-16
    if (platformID === 0 || platformID === 3) {
        const str = [];
        for(let i=0, e=length/2; i<e; i++) str[i] = String.fromCharCode(p.uint16);
        return str.join(``);
    }

    // Everything else, we treat as plain bytes.
    const bytes = p.readBytes(length);
    const str = [];
    bytes.forEach(function(b,i) { str[i] = String.fromCharCode(b); });
    return str.join(``);

    // TODO: if someone wants to finesse this/implement all the other string encodings, have at it!
}

export { name };
