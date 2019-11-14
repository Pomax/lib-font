(function Font(scope, gzipDecode, brotliDecode) {
    "use strict";


    /**
     * Simple event object so people can write the
     * same code they would for anything else.
     */
    class Event {
        constructor(type, detail={}, msg) {
            this.type = type;
            this.detail = detail;
            this.msg = msg;
            Object.defineProperty(this, `__mayPropagate`, { enumerable: false, writable: true });
            this.__mayPropagate = true;
        }
        preventDefault() { /* doesnothing */ }
        stopPropagation() { this.__mayPropagate =false; }
        valueOf() { return this; }
        toString() { return this.msg ? `[${this.type} event]: ${this.msg}` : `[${this.type} event]`; }
    }


    /**
     * Simple event manager so people can write the
     * same code they would for anything else.
     */
    class EventManager {
        constructor() {
            this.listeners = {};
        }
        addEventListener(type, listener, useCapture) {
            let bin = this.listeners[type] || [];
            if (useCapture) bin.unshift(listener); else bin.push(listener);
            this.listeners[type] = bin;
        }
        removeEventListener(type, listener) {
            let bin = this.listeners[type] || [];
            let pos = bin.findIndex(e => e===listener);
            if (pos > -1) {
                bin.splice(pos, 1);
                this.listeners[type] = bin;
            }
        }
        dispatch(event) {
            let bin = this.listeners[event.type];
            if (bin) {
                for(let l=0, e=bin.length; l<e; l++) {
                    if (!event.__mayPropagate) break;
                    bin[l](event);
                }
            }
        }
    }


    /**
     * either return the appropriate CSS format
     * for a specific font URL, or generate an 
     * error if someone is trying to use a
     * font that died years ago.
     * 
     * @param {*} path 
     */
    function getFontCSSFormat(path) {
        let pos = path.lastIndexOf(`.`);
        let ext = (path.substring(pos + 1) || ``).toLowerCase();
        let format = {
            ttf: `truetype`,
            otf: `opentype`,
            woff: `woff`,
            woff2: `woff2`
        }[ext];

        if (format) return format;

        let msg = {
            eot: `The .eot format is not supported: it died in January 12, 2016, when Microsoft retired all versions of IE that didn't already support WOFF.`,
            svg: `The .svg format is not supported: SVG fonts (not to be confused with OpenType with embedded SVG) were so bad we took the entire fonts chapter out of the SVG specification again`,
            fon: `The .fon format is not supported: these are an ancient Windows bitmap font format`,
            ttc: `Font collections are not supported by browsers, as no CSS instructions exist to indicate which font inside a collection to use in a @font-face declaration.`
        }[ext];

        if (!msg) msg = `${url} is not a font.`;

        this.dispatch(new Event(`error`, {}, msg));
    }


    /**
     * Borderline trivial http response helper function
     * 
     * @param {HttpResponse} response 
     */
    function checkFetchResponseStatus(response) {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }
        return response;
    }

    /**
     * Convert an array of uint8 char into a proper string.
     * 
     * @param {uint8[]} data 
     */
    function asText(data) {
        return Array.from(data).map(v => String.fromCharCode(v)).join(``);
    }

    /**
     * Build late-evaluating properties for each table in a
     * woff/woff2 font, so that accessing a table via the
     * woff.tables.tableName or woff2.tables.tableName
     * property kicks off a table parse on first access.
     * 
     * @param {*} woff the woff or woff2 font object
     * @param {DataView} dataview passed when dealing with woff
     * @param {buffer} decoded passed when dealing with woff2
     */
    function buildWoffLazyLookups(woff, dataview, decoded) {
        woff.tables = {};
        woff.directory.forEach(entry => {
            let table = false;
            let tableFn = () => {};

            // woff2 handling requires parsing within pre-unpacked table data.
            if (decoded) {
                tableFn = () => {
                    const useTransform = typeof entry.transformLength !== "undefined";
                    const data = decoded.slice(entry.origOffset, entry.origOffset + (useTransform ? entry.transformLength : entry.origLength));
                    table = createTable({ tag: entry.tag, offset: 0, length: entry.origLength }, new DataView(data.buffer));
                };
            }

            // woff handling requires gzip.inflate'ing table data before parsing
            else {
                tableFn = () => {
                    let offset = 0;
                    let view = dataview;
                    if (entry.compLength !== entry.origLength) {
                        const unpacked = gzipDecode(new Uint8Array(dataview.buffer.slice(entry.offset, entry.offset + entry.compLength)));
                        view = new DataView(unpacked.buffer);
                    } else { offset = entry.offset; }
                    table = createTable({ tag: entry.tag, offset, length: entry.origLength }, view);
                };
            }
            
            Object.defineProperty(woff.tables, entry.tag.trim(), {
                get: () => { if (table) return table; tableFn(); return table; }
            });
        });
    }


    // ====================


    /**
     * A data parser for table data, with auto-advancing pointer.
     */
    class Parser {
        constructor(name, dict, dataview) {
            this.name = name;
            this.length = dict.length;
            this.start = dict.offset;
            this.offset = 0;
            this.data = dataview;

            [   `getInt8`,
                `getUint8`,
                `getInt16`,
                `getUint16`,
                `getInt32`,
                `getUint32`,
                `getBigInt64`,
                `getBigUint64`
            ].forEach(name => {
                let fn = name.replace(/get(Big)?/,'').toLowerCase();
                let increment = parseInt(name.replace(/[^\d]/g,'')) / 8;
                Object.defineProperty(this, fn, {
                    get: () => this.getValue(name, increment)
                });
            });

            Object.defineProperty(this, `fixed`, {
                get: () => {
                    let major = this.uint16;
                    let minor = Math.round(1000 * this.uint16/65356);
                    return major + minor/1000;
                }
            })

            Object.defineProperty(this, `tag`, {
                get: () => {
                    const t = this.uint32;
                    return asText([t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, t & 255]);
                }
            })

            Object.defineProperty(this, `uint128`, {
                // I have no idea why the variable uint128 was chosen over a
                // fixed-width uint32, but it was, and so we need to decode it.
                get: () => {
                    let value = 0;
                    for (let i=0; i<5; i++) {
                        let byte = this.uint8;
                        value = (value * 128) + (byte & 127);
                        if (byte < 128) break;
                    }
                    return value;
                }
            })
        }
        getValue(type, increment) {
            let pos = this.start + this.offset;
            this.offset += increment;
            try {
                return this.data[type](pos);
            } catch (e) {
                console.error(`parser`, type, increment, this);
                console.error(`parser`, this.start, this.offset);
                throw e;
            }
        }
        flags(n) {
            if (n === 8 || n === 16 || n === 32 || n === 64) {
                return this[`uint${n}`].toString(2).padStart(n,0).split(``).map(v => v==="1");
            }
            console.error(`Error parsing flags: flag types can only be 1, 2, 4, or 8 bytes long`);
            console.trace();
        }
        verifyLength() {
            if (this.offset != this.length) {
                console.error(`unexpected parsed table size (${this.offset}) for "${this.name}" (expected ${this.length})`);
            }
        }
    }

    /**
     * Table factory
     * @param {*} dict 
     * @param {*} dataview 
     */
    function createTable(dict, dataview) {
        if (dict.tag === `head`) return new head(dict, dataview);
        if (dict.tag === `gasp`) return new gasp(dict, dataview);
        if (dict.tag === `fvar`) return new fvar(dict, dataview);
        if (dict.tag === `OS/2`) return new OS2(dict, dataview);
        // further code goes here once more table parsers exist
        return {};
    }

    /**
     * The fvar variation axis record class
     */
    class VariationAxisRecord {
        constructor(dataview, offset) {
            const p = new Parser(`variation axis record`, { offset }, dataview);
            this.tag = p.tag;
            this.minValue = p.fixed;
            this.defaultValue = p.fixed;
            this.maxValue = p.fixed;
            this.flags = p.flags(16);
            this.axisNameID = p.uint16;
        }
    }

    /**
     * the OpenType `fvar` table.
     */
    class fvar {
        constructor(dict, dataview) {
            const p = new Parser(`fvar2`, dict, dataview);
            this.majorVersion = p.uint16;
            this.minorVersion = p.uint16;
            this.axesArrayOffset = p.uint16;
            p.uint16;
            this.axisCount = p.uint16;
            this.axisSize = p.uint16;
            this.instanceCount = p.uint16;
            this.instanceSize = p.uint16;

            const recordOffset = p.offset;
            this.axes = [... new Array(this.axisCount)].map((_,i) =>
                new VariationAxisRecord(dataview, recordOffset + i * 4)
            );
        }   
    }


    /**
     * The OpenType `OS/2` table.
     */
    class OS2 {
        constructor(dict, dataview) {
            const p = new Parser(`OS/2`, dict, dataview);
            this.version = p.uint16;
            this.xAvgCharWidth = p.int16;
            this.usWeightClass = p.uint16;
            this.usWidthClass = p.uint16;
            this.fsType = p.uint16;
            this.ySubscriptXSize = p.int16;
            this.ySubscriptYSize = p.int16;
            this.ySubscriptXOffset = p.int16;
            this.ySubscriptYOffset = p.int16;
            this.ySuperscriptXSize = p.int16;
            this.ySuperscriptYSize = p.int16;
            this.ySuperscriptXOffset = p.int16;
            this.ySuperscriptYOffset = p.int16;
            this.yStrikeoutSize = p.int16;
            this.yStrikeoutPosition = p.int16;
            this.sFamilyClass = p.int16;
            this.panose = [... new Array(10)].map(_ => p.uint8);
            this.ulUnicodeRange1 = p.flags(32);
            this.ulUnicodeRange2 = p.flags(32);
            this.ulUnicodeRange3 = p.flags(32);
            this.ulUnicodeRange4 = p.flags(32);
            this.achVendID = p.tag;
            this.fsSelection = p.uint16;
            this.usFirstCharIndex = p.uint16;
            this.usLastCharIndex = p.uint16;
            this.sTypoAscender = p.int16;
            this.sTypoDescender = p.int16;
            this.sTypoLineGap = p.int16;
            this.usWinAscent = p.uint16;
            this.usWinDescent = p.uint16;
            if (this.version === 0) p.verifyLength();
            this.ulCodePageRange1 = p.flags(32);
            this.ulCodePageRange2 = p.flags(32);
            if (this.version === 1) p.verifyLength();
            this.sxHeight = p.int16;
            this.sCapHeight = p.int16;
            this.usDefaultChar = p.uint16;
            this.usBreakChar = p.uint16;
            this.usMaxContext = p.uint16;
            if (this.version > 1 && this.version <= 4) p.verifyLength();
            this.usLowerOpticalPointSize = p.uint16;
            this.usUpperOpticalPointSize = p.uint16;
            if (this.version === 5) p.verifyLength();
        }
    }

    /**
     * The OpenType `head` table.
     */
    class head {
        constructor(dict, dataview) {
            const p = new Parser(`head`, dict, dataview);
            this.majorVersion = p.uint16;
            this.minorVersion = p.uint16;
            this.fontRevision = p.fixed;
            this.checkSumAdjustment = p.uint32;
            this.magicNumber = p.uint32;
            this.flags = p.flags(16);
            this.unitsPerEm = p.uint16;
            let startDate = (new Date(`1904-01-01T00:00:00+0000`)).getTime();
            this.created = new Date(startDate + 1000 * parseInt(p.int64.toString()));
            this.modified = new Date(startDate + 1000 * parseInt(p.int64.toString()));
            this.xMin = p.int16;
            this.yMin = p.int16;
            this.xMax = p.int16;
            this.yMax = p.int16;
            this.macStyle = p.flags(16);
            this.lowestRecPPEM = p.uint16;
            this.fontDirectionHint = p.uint16;
            this.indexToLocFormat = p.uint16;
            this.glyphDataFormat = p.uint16;
            p.verifyLength();
        }
    }

    /**
     * GASPRange record
     */
    class GASPRange {
        constructor(dataview, offset) {
            const p = new Parser("gasp range", { offset }, dataview);
            this.rangeMaxPPEM = p.uint16;
            this.rangeGaspBehavior = p.uint16;
        }
    }

    /**
     * The OpenType `gasp` table.
     */
    class gasp {
        constructor(dict, dataview) {
            const p = new Parser(`gasp`, dict, dataview);
            this.version = p.uint16;
            this.numRanges = p.uint16;

            const gaspOffset = p.offset;
            this.gaspRange = [... new Array(this.numRanges)].map((_,i) =>
                new GASPRange(dataview, gaspOffset + i * 4)
            );
        }
    }

    /**
     * Table Record struct.
     */
    class TableRecord {
        constructor(dataview, offset) {
            const p = new Parser("table record", { offset }, dataview);
            this.tag = p.tag;
            this.checksum = p.uint32;
            this.offset = p.uint32;
            this.length = p.uint32;
        }
    }

    /**
     * the SFNT header.
     *
     * See https://docs.microsoft.com/en-us/typography/opentype/spec/overview for more information
     */
    class SFNTheader {
        constructor(dataview) {
            const p = new Parser("sfnt", { offset: 0 }, dataview);
            this.version = p.uint32;
            this.numTables = p.uint16;
            this.searchRange = p.uint16;
            this.entrySelector = p.uint16;
            this.rangeShift = p.uint16;

            // parse the dictionary
            const dictOffset = 12;
            this.directory = [... new Array(this.numTables)].map((_,i) =>
                new TableRecord(dataview, dictOffset + i * 16)
            );

            // add convenience bindings for each table, with lazy loading
            this.tables = {};
            this.directory.forEach(entry => {
                let table = false;
                Object.defineProperty(this.tables, entry.tag.trim(), {
                    get: () => {
                        if (table) return table;
                        table = createTable({
                            tag: entry.tag,
                            offset: entry.offset,
                            length: entry.length
                        }, dataview);
                        return table;
                    }
                });
            });
        }
    }

    /**
     * ...
     */
    class WoffTableDirectoryEntry {
        constructor(dataview, offset) {
            const p = new Parser("woff", { offset, length: 20 }, dataview);
            this.tag = p.tag;
            this.offset = p.uint32;
            this.compLength = p.uint32;
            this.origLength = p.uint32;
            this.origChecksum = p.uint32;
            p.verifyLength();
        }
    }

    /**
     * The WOFF header
     * See https://www.w3.org/TR/WOFF for more information
     */
    class WOFFHeader {
        constructor(dataview) {
            const p = new Parser("woff", { offset: 0, length: 44 }, dataview);
            this.signature = p.tag;
            this.flavor = p.uint32;
            this.length = p.uint32;
            this.numTables = p.uint16;
            p.uint16;
            this.totalSfntSize = p.uint32;
            this.majorVersion = p.uint16;
            this.minorVersion = p.uint16;
            this.metaOffset = p.uint32;
            this.metaLength = p.uint32;
            this.metaOrigLength = p.uint32;
            this.privOffset = p.uint32;
            this.privLength = p.uint32;
            p.verifyLength();

            // parse the dictionary
            let dictOffset = p.offset;
            this.directory = [... new Array(this.numTables)].map((_,i) =>
                new WoffTableDirectoryEntry(dataview, dictOffset + i * 20)
            );

            buildWoffLazyLookups(this, dataview);
        }
    }

    /**
     * WOFF2 uses a numbered tag registry, such that only unknown tables require a 4 byte tag
     * in the WOFF directory entry struct. Everything else uses a uint8. Nice and tidy.
     * @param {*} flag
     */
    function getWOFF2Tag(flag) {
        return [
            `cmap`,`head`,`hhea`,`hmtx`,`maxp`,`name`,`OS/2`,`post`,`cvt `,`fpgm`,`glyf`,`loca`,`prep`,
            `CFF `,`VORG`,`EBDT`,`EBLC`,`gasp`,`hdmx`,`kern`,`LTSH`,`PCLT`,`VDMX`,`vhea`,`vmtx`,`BASE`,
            `GDEF`,`GPOS`,`GSUB`,`EBSC`,`JSTF`,`MATH`,`CBDT`,`CBLC`,`COLR`,`CPAL`,`SVG `,`sbix`,`acnt`,
            `avar`,`bdat`,`bloc`,`bsln`,`cvar`,`fdsc`,`feat`,`fmtx`,`fvar`,`gvar`,`hsty`,`just`,`lcar`,
            `mort`,`morx`,`opbd`,`prop`,`trak`,`Zapf`,`Silf`,`Glat`,`Gloc`,`Feat`,`Sill`
        ][flag];
    }

    /**
     * WOFF2 Table Directory Entry
     */
    class Woff2TableDirectoryEntry {
        constructor(dataview, offset) {
            const p = new Parser("WOFF2 table record", { offset }, dataview);
            this.flags = p.uint8;

            const tagNumber  = this.tagNumber = this.flags & 63;
            if (tagNumber === 63) {
                this.tag = p.tag;
            } else {
                this.tag = getWOFF2Tag(tagNumber);
            }

            this.origLength = p.uint128;
            const pptVersion = this.pptVersion = this.flags >> 6;
            if (pptVersion !== 0 || ((this.tag === 'glyf' || this.tag === 'loca') && pptVersion !== 3)) {
                this.transformLength = p.uint128;
            }
            this.length = p.offset;
        }
    }

    /**
     * The WOFF2 header
     * See https://www.w3.org/TR/WOFF2 for more information
     */
    class WOFF2Header {
        constructor(dataview) {
            const p = new Parser("woff2", { offset: 0, length: 48 }, dataview);
            this.signature = p.tag;
            this.flavor = p.uint32;
            this.length = p.uint32;

            this.numTables = p.uint16;
            p.uint16 // why woff2 even has any reserved bytes is a complete mystery. But it does.

            this.totalSfntSize = p.uint32;
            this.totalCompressedSize = p.uint32;
            this.majorVersion = p.uint16;
            this.minorVersion = p.uint16;
            this.metaOffset = p.uint32;
            this.metaLength = p.uint32;
            this.metaOrigLength = p.uint32;
            this.privOffset = p.uint32;
            this.privLength = p.uint32;
            p.verifyLength();

            // parse the dictionary
            let dictOffset = p.offset;
            this.directory = [... new Array(this.numTables)].map((_,i) => {
                let entry = new Woff2TableDirectoryEntry(dataview, dictOffset);
                dictOffset += entry.length;
                return entry;
            });

            // compute table byte offsets in the decompressed data
            this.directory[0].origOffset = 0;
            this.directory.forEach((e,i) => {
                let t = this.directory[i+1]
                if (t) {
                    const useTransform = typeof e.transformLength !== "undefined";
                    t.origOffset = e.origOffset + (useTransform ? e.transformLength : e.origLength);
                }
            });

            // then decompress the original data and lazy-bind
            let decoded = brotliDecode(new Uint8Array(dataview.buffer.slice(dictOffset)));
            buildWoffLazyLookups(this, false, decoded);
        }
    }

    /**
     * The Font object, which the WebAPIs are still sorely missing.
     */
    class Font extends EventManager {
        constructor(name, options={}) {
            super();
            this.name = name;
            this.options = options;
        }

        /**
         * Just like Image and Audio, we kick everything off when
         * our `src` gets assigned.
         *
         * @param {string} url
         */
        set src(url) {
            this.__src = url;
            this.defineFontFace(this.name, url, this.options);
            this.loadFont(url);
        }

        get src() { return this.__src; }

        /**
         * This is a blocking operation.
         */
        defineFontFace(name, url, options) {
            let format = getFontCSSFormat(url);
            if (!format) return;
            let style = document.createElement(`style`);
            style.className = `injected by Font.js`;
            let rules = Object.keys(options).map(r => `${r}: ${options[r]};`).join(`\n\t`);
            style.textContent = `@font-face {\n\tfont-family: "${name}";\n\t${rules}\n\tsrc: url("${url}") format("${format}");\n}`;
            this.styleElement = style;
            document.head.appendChild(style);
        }

        /**
         * This is a non-blocking operation.
         *
         * @param {String} url The URL for the font in question
         */
        async loadFont(url) {
            const type = getFontCSSFormat(url);
            fetch(url)
            .then(response => checkFetchResponseStatus(response) && response.arrayBuffer())
            .then(buffer => this.fromDataBuffer(buffer, type))
            .catch(err => {
                const evt = new Event(`error`, err, `Failed to load font at ${url}`);
                this.dispatch(evt);
                if (this.onerror) this.onerror(evt);
            });
        }

        /**
         * This is a non-blocking operation.
         *
         * @param {Buffer} buffer The binary data associated with this font.
         */
        async fromDataBuffer(buffer, type) {
            this.fontData = new DataView(buffer); // Because we want to enforce Big Endian everywhere
            await this.parseBasicData(type);
            const evt = new Event("load", { font: this });
            this.dispatch(evt);
            if (this.onload) this.onload(evt);
        }

        /**
         * This is a non-blocking operation if called from an async function
         */
        async parseBasicData(type) {
            if (type === `truetype` || type === `opentype`) {
                this.sfnt = new SFNTheader(this.fontData);
            }
            if (type === `woff`) {
                this.woff = new WOFFHeader(this.fontData);
            }
            if (type === `woff2`) {
                this.woff2 = new WOFF2Header(this.fontData);
            }
        }
    }

    scope.Font = Font;
})(this, this.pako ? this.pako.inflate : undefined, this.unbrotli);
