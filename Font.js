// basic inmports
import { EventManager } from "./eventing.js";
import { SFNT, WOFF, WOFF2 } from "./opentype.js";

/**
 * ...docs go here...
 */
(function Font() {
    "use strict";

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
                this.sfnt = new SFNT(this.fontData);
            }
            if (type === `woff`) {
                this.woff = new WOFF(this.fontData);
            }
            if (type === `woff2`) {
                this.woff2 = new WOFF2(this.fontData);
            }
        }
    }

    window.Font = Font;
})();
