(function Font(scope) {
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


    // ====================


    function getFontCSSFormat(path) {
        let pos = path.lastIndexOf(`.`);
        let ext = (path.substring(pos + 1) || ``).toLowerCase();
        let format = {
            ttf: `truetype`,
            otf: `opentype`,
            woff: `WOFF`,
            woff2: `WOFF2`
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

    function checkFetchResponseStatus(response) {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }
        return response;
    }

    function asText(data) {
        return Array
        .from(data)
        .map(v => String.fromCharCode(v))
        .join(``);
    }

    function lazy(object, property, getter) {
        Object.defineProperty(object, property, {
            get: getter
        });
    } 

    function createTable(dict, dataview) {
        if (dict.tag === `head`) return new head(dict, dataview);
        // further code goes here
        return {};
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
        }
        getValue(type, increment) {
            let pos = this.start + this.offset;
            this.offset += increment;
            return this.data[type](pos);
        }
        flags(n) {
            if (n === 8 || n === 16 || n === 32 || n === 64) {
                return this[`uint${n}`].toString(2).padStart(16,0).split(``).map(v => v==="1");
            }
            console.error(`Error parsing flags: flag types can only be 1, 2, 4, or 8 bytes long`);
            console.trace();
        }
        verifyLength() {
            if (this.offset != this.length) {
                console.error(`unexpected parsed table size for "${this.name}" (${this.offset} != ${this.length})`);
            }
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
            let major = p.uint16;
            let minor = Math.round(1000 * p.uint16/65356);
            this.fontRevision = `${major}.${minor}`;
            this.checkSumAdjustment = p.uint32;
            this.magicNumber = p.uint32;
            this.flags = p.flags(16);
            this.unitsPerEm = p.uint16;
            let startDate = (new Date(`1904-01-01T00:00:00+0000`)).getTime();
            this.created = new Date(startDate + 1000 * parseInt(p.int64.toString()));
            this.modified = new Date(startDate + 1000 * parseInt(p.int64.toString()));;
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
     * Table Record struct.
     */
    class TableRecord {
        constructor(dataview, start) {
            const p = new Parser("sfnt", { offset: start }, dataview);
            const t = p.uint32;
            this.tag = asText([t>>24, t>>16 & 255, t>>8 & 255, t & 255]);
            this.offset = p.uint32;
            this.length = p.uint32;
            this.checksum = p.uint32;
            lazy(this, `table`, () => createTable(this, dataview));
        }
    }

    /**
     * the SFNT header.
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
            this.tables = [... new Array(this.numTables)].map((_,i) =>
                new TableRecord(dataview, dictOffset + i * 16)
            );

            // add convenience bindings for each table, with lazy loading
            this.tables.forEach(dict => {
                lazy(this, dict.tag.trim(), () => dict.table);
            });
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
            style.textContent = `@font-face {\n\tfont-family: '${name}';\n\t${rules}\n\tsrc: url('${url}') format(${format});\n}`;
            this.styleElement = style;
            document.head.appendChild(style);
        }

        /**
         * This is a non-blocking operation.
         * 
         * @param {String} url The URL for the font in question 
         */
        async loadFont(url) {
            fetch(url)
            .then(response => checkFetchResponseStatus(response) && response.arrayBuffer())
            .then(buffer => this.fromDataBuffer(buffer))
            .catch(err => {
                console.error(err);
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
        async fromDataBuffer(buffer) {
            this.fontData = new DataView(buffer); // Because we want to enforce Big Endian everywhere
            await this.parseBasicData();
            const evt = new Event("load", { font: this });
            this.dispatch(evt);
            if (this.onload) this.onload(evt);
        }

        /**
         * This is a non-blocking operation if called from an async function
         */
        async parseBasicData() {
            this.sfnt = new SFNTheader(this.fontData);
        }
    }

    scope.Font = Font;
})(this);
