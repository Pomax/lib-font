import "./src/utils/shim-fetch.js";
import { Event, EventManager } from "./src/eventing.js";
import { SFNT, WOFF, WOFF2 } from "./src/opentype/index.js";
import { loadTableClasses } from "./src/opentype/tables/createTable.js";
import { setupFontFace } from "./src/utils/fontface.js";
import { validFontFormat } from  "./src/utils/validator.js";

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
 * The Font object, which the WebAPIs are still sorely missing.
 */
class Font extends EventManager {
    constructor(name, options={}) {
        super();
        this.name = name;
        this.options = options;
        this.metrics = false;
    }

    get src() { return this.__src; }

    /**
     * Just like Image and Audio, we kick everything off when
     * our `src` gets assigned.
     *
     * @param {string} source url for this font ("real" or blob/base64)
     */
    set src(src) {
        this.__src = src;
        (async() => {
            if (globalThis.document && !this.options.skipStyleSheet) {
                await setupFontFace(this.name, src, this.options);
            }
            this.loadFont(src);
        })();
    }

    /**
     * This is a non-blocking operation.
     *
     * @param {String} url The URL for the font in question
     * @param {String} filename The filename to use when URL is a blob/base64 string
     */
    async loadFont(url, filename) {
        fetch(url)
        .then(response => checkFetchResponseStatus(response) && response.arrayBuffer())
        .then(buffer => this.fromDataBuffer(buffer, filename || url))
        .catch(err => {
            const evt = new Event(`error`, err, `Failed to load font at ${filename || url}`);
            this.dispatch(evt);
            if (this.onerror) this.onerror(evt);
        });
    }

    /**
     * This is a non-blocking operation.
     *
     * @param {Buffer} buffer The binary data associated with this font.
     */
    async fromDataBuffer(buffer, typeOrPath) {
        this.fontData = new DataView(buffer); // Big Endian
        let type = validFontFormat(this.fontData);
        if (!type) {
            // handled in loadFont's .catch()
            throw new Error(`${typeOrPath} is either an unsupported font format, or not a font at all.`);
        }
        await this.parseBasicData(type);
        const evt = new Event("load", { font: this });
        this.dispatch(evt);
        if (this.onload) this.onload(evt);
    }

    /**
     * This is a non-blocking operation IF called from an async function
     */
    async parseBasicData(type) {
        return loadTableClasses().then(createTable => {
            if (type === `SFNT`) {
                this.opentype = new SFNT(this.fontData, createTable);
            }
            if (type === `WOFF`) {
                this.opentype = new WOFF(this.fontData, createTable);
            }
            if (type === `WOFF2`) {
                this.opentype = new WOFF2(this.fontData, createTable);
            }
            return this.opentype;
        });
    }

    /**
     * Does this font support the specified character?
     * @param {*} char
     */
    getGlyphId(char) {
        return this.opentype.tables.cmap.getGlyphId(char);
    }

    /**
     * find the actual "letter" for a given glyphid
     * @param {*} glyphid
     */
    reverse(glyphid) {
        return this.opentype.tables.cmap.reverse(glyphid);
    }

    /**
     * Does this font support the specified character?
     * @param {*} char
     */
    supports(char) {
        return this.getGlyphId(char) !== 0
    }

    /**
     * Does this font support the specified unicode variation?
     * @param {*} variation
     */
    supportsVariation(variation) {
        return this.opentype.tables.cmap.supportsVariation(variation) !== false;
    }

    /**
     * Effectively, be https://html.spec.whatwg.org/multipage/canvas.html#textmetrics
     * @param {*} text
     * @param {*} size
     */
    measureText(text, size=16) {
        if (this.__unloaded) throw new Error("Cannot measure text: font was unloaded. Please reload before calling measureText()");
        let d = document.createElement('div');
        d.textContent = text;
        d.style.fontFamily = this.name;
        d.style.fontSize = `${size}px`;
        d.style.color = `transparent`;
        d.style.background = `transparent`;
        d.style.top = `0`;
        d.style.left = `0`;
        d.style.position = `absolute`;
        document.body.appendChild(d);
        let bbox = d.getBoundingClientRect();
        document.body.removeChild(d);
        const OS2 = this.opentype.tables["OS/2"];
        bbox.fontSize = size;
        bbox.ascender = OS2.sTypoAscender;
        bbox.descender = OS2.sTypoDescender;
        return bbox;
    }

    /**
     * unload this font from the DOM context, making it no longer available for CSS purposes
     */
    unload() {
        if (this.styleElement.parentNode) {
            this.styleElement.parentNode.removeElement(this.styleElement);
            const evt = new Event("unload", { font: this });
            this.dispatch(evt);
            if (this.onunload) this.onunload(evt);
        }
        this._unloaded = true;
    }

    /**
     * load this font back into the DOM context after being unload()'d earlier.
     */
    load() {
        if (this.__unloaded) {
            delete this.__unloaded;
            document.head.appendChild(this.styleElement);
            const evt = new Event("load", { font: this });
            this.dispatch(evt);
            if (this.onload) this.onload(evt);
        }
    }
}

globalThis.Font = Font;

export { Font };
