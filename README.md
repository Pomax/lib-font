# LibFont - lifting the hood on your fonts

If you're looking for the (really) old ES5 version of LibFont, when it was still called "Font.js", you should be able to find it [here](https://github.com/Pomax/lib-font/tree/v2015).


## td;dr:

#### Node installation

Use `npm install lib-font`, after which the package can be imported using `import { Font } from "lib-font"`.

Note that there is no legacy commonjs version of this library available. Node LTS 14 and above have native support ES modules - Have a look at `babel`'s [transform-modules-commonjs](https://babeljs.io/docs/en/babel-plugin-transform-modules-commonjs) plugin if you really have no choice but to use commonjs.

#### Browser "installation"

Download the [`./dist/lib-font.js`](https://github.com/Pomax/lib-font/tree/master/dist/lib-font.js) file and put it wherever your codebase puts third party libraries. Then load it in the browser using a modern module script tag in the `<head>`, of the form `<script type="module" src=".../lib-font.js" async>`.

Note that there is no legacy ES5 version of this library available. Every modern browser supports ES modules. Have a lookt at [babel](https://babeljs.io/) if you really have no choice but to use ES5.

## Introduction

What if you could actually inspect your fonts? In the same context that you actually _use_ those fonts?

That's what this is for:

```js
// Create a font object
const myFont = new Font(`Adobe Source Code Pro`);

// Assign event handling (.addEventListener version supported too, of course)
myFont.onerror = evt => console.error(evt);
myFont.onload = evt => doSomeFontThings(evt);

// Kick off the font load by setting a source file, exactly as you would
// for an <img> or <script> element when building them as nodes in JS.
myFont.src = `./fonts/SourceCodeVariable-Roman.otf`;

// When the font's up and loaded in, let's do some testing!
function doSomeFontThings(evt) {
    // We can either rely on scoped access to font, but because the onload function
    // is not guaranteed to live in the same scope, the font is in the event, too.
    const font = evt.detail.font;

    // First, let's test some characters:
    [`a`, `→`, `嬉`].forEach(char => console.log(`Font supports '${char}': ${
        font.supports(char)
    }`));

    // Then, let's check some OpenType things
    const GSUB = font.opentype.tables.GSUB;

    // Let's figure out which writing scripts this font supports:
    console.log(`This font supports the following scripts: ${
        `"${GSUB.getSupportedScripts().join(`", "`)}"`
    }`);

    // DFLT is a given, but let's see if `latn` has any special language/system rules...
    const latn = GSUB.getScriptTable('latn');
    console.log(`Special langsys for "latn": ${
        `"${GSUB.getSupportedLangSys(latn).join(`", "`)}"`
    }`);

    // Wow, "Northern Sami" support? Really? Which OpenType features does that use?
    const nsm = GSUB.getLangSysTable(latn, "NSM ");
    console.log(`OpenType features for the Northern Sami version of latin script:`,
        `"${GSUB.getFeatures(nsm).map(f => f.featureTag).join(`", "`)}"`
    );

    // Oh wait, this is a variable font, isn't it.
    console.log(`This is a variable font: ${!!font.opentype.tables.fvar}`);

    // Which axes does it support?
    console.log(`This variable font supposed the following axes: ${
        `"${font.opentype.tables.fvar.getSupportedAxes().join(`", "`)}"`
    }`);
}
```

You can also pass in a file directly, e.g. using the [HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API). In order to deal with the font as bytecode, you can use the `font.fromDataBuffer(bytecode, filename)` function to kick off the font loading:

```js
const myFont = new Font(`Adobe Source Code Pro`);

// Grab file frop drop event or file upload
const file = e.target.files[0];

// Use FileReader to, well, read the file
const reader = new FileReader();
reader.readAsArrayBuffer(file);

reader.onload = function() {
    // Pass the buffer, and the original filename
    myFont.fromDataBuffer(reader.result, file.name);
    myFont.onload = e => {
        // ...
    };
};
```

#### What about a tag?

This library does not offer a `<font src="..." ...>` tag, in part because proper custom elements _must_ have a hyphen in their name, but primarily because the only DOM related work that a `<font>` tag would be useful for is already handled by `<style>` (for declaring a `@font-face`) and `<link>` (for importing a `@font-face` stylesheet).



## API

The uplifted library API is still pending... As of right now, a lot of the functions and properties are pretty easily found if you know your way around an OpenType font already by looking at the source as well as the tests, but that's not ideal - API docs [will be forthcoming](https://github.com/Pomax/lib-font/issues/93) but can always use help.

That said, this section will keep getting expanded as the API gets consolidated.

### Font

#### ● `const f = new Font(fontFamilyName, optionsObject)`

The family name is use for stylesheet building, and the options object can contain the following fields:

fieldname | type | default | description
--- | --- | --- | ---
skipStyleSheet | boolean | false | Determines whether not to build the `@font-face` stylesheet.
styleRules | object | `{}` | A set of key/value pairs representing CSS rules to add to the `@font-face` declaration
errorOnStyle | boolean | false | Whether to error out, or merely warn, if the font type cannot be determined from the `src` assignment.

#### ● `f.onerror = evt => ...` / `f.addEventListener('error', evt => ...)`

Error handling for anything font related

#### ● `f.onload = evt => ...` / `f.addEventListener('load', evt => ...)`

Load handling for anything font related

#### ● `f.src = ...`

Bind a font to a source URL. This can be a fully qualified URL, a relative URL, a Blob URL, or a Data-URL.

#### ● `const actualFont = f.opentype`

The actual opentype font representation is font in the `.opentype` property.

#### ● `const fontTables = f.opentype.tables`

This is the main access point for any font table, where each table is accessed directly by name. E.g. in order to access the `cmap` table, you use `const cmap = f.opentype.tables.cmap`, GSUB is `const GSUB = f.opentype.tables.GSUB`, etc.



## Development

While the whole point of ES modules is that you don't need to bundle anything because both the browser and node can be told to load the main file, and dependencies are automatically resolved, there is a `dist` build task that can be run using `npm run build` that builds a rolled up version of the library as a single file.

This is equivalent to running the following command:

```bash
$ npx rollup --no-treeshake --format=esm lib-font.js > dist/lib-font.js
```

Note that this does not include the `inflate` and `unbrotli` libraries from the `./lib` directory: as optional dependencies, they're intentionally left out when you roll up the code. Without them, plain opentype parsing will still work perfectly fine, but woff and woff2 parsing obviously won't.

Also note that this is not minified code: gzip is already pretty great at making things small, and if you need things even smaller than that, your project presumably has its own minification task(s) in place.

**WARNING: THIS DOES NOT CURRENTLY YIELD A WORKING FILE, DUE TO ROLLUP RENAMING CRUCIAL VARIABLES**

### Testing

The `npm test` command should be all you need in order to run the tests, provided you ran `npm install` first, of course.

- Node based testing uses Jest tests, found in the `./testing/node` dir.
- Browser based testing uses Puppetter, found in the `./testing/browser/tests` dir.



## Compatibility

This library is designed to run both in any browser and version of Node.js versions that supports [es modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).

- Browsers: see the [caniuse matrix](https://caniuse.com/?search=modules) (tl;dr: basically everything except IE11).
- Node: native support as of v14 (`--experimental-modules` runtime option as of v12).



## Preemptive answers to questions

#### Why don't woff/woff2 work?

They do, but they rely on having the gzip inflater and brotli decoder libraries loaded. You can find those in the `./lib` dir, as they are optional: without them regular parsing still works fine, but with `inflate` loaded, woff parsing will succeed, and with `unbrotli` loaded, woff2 parsing will succeed.

To make this work on your own pages, add the following bit to your document head, with the appropriate path to these two libraries, of course:

```html
    <script src="./lib/inflate.js" defer></script>
    <script src="./lib/unbrotli.js" defer></script>
```

#### Why can't this draw stuff??

Because you already have lots of text shaping engines available. In the browser, it's literally your browser (you can already draw all the text you need, properly shaped and typeset, both in HTML and on a Canvas). In node, it's whatever graphics library you're using to already draw everything else you need to draw.

Proper OpenType text shaping is _incredibly complex_ and requires _a lot_ of specialized code; there is no reason for this library to pretend it supports text shaping when it's guaranteed to do it worse than other technologies you're already using.

#### Why would I use this instead of OpenType.js or Fontkit or something?

I don't have a good answer to that. Those are some great projects, you probably _should_ use them if they do what you need? The reason _I_ needed this is because it doesn't do text shaping: it just lets me query the opentype data to get me the information I need, without being too big of a library. And [I've written](https://github.com/Pomax/PHP-Font-Parser) enough [OpenType parsers](https://github.com/Pomax/A-binary-parser-generator) to know [how much code](http://processingjs.nihongoresources.com/glyphing/) goes into the [actual shaping](https://pomax.github.io/CFF-glyphlet-fonts/).

#### Alright, what if I have opinions?

Tweet at me! [@TheRealPomax](http://twitter.com/TheRealPomax) or [@TheRealPomax@Mastodon.social](https://mastodon.social/@TheRealPomax) should do nicely, but if you want to have an in-depth discussion, I'd recommend filing an issue, since 280 characters per message is not really sufficient to dig into OpenType details.

#### And if I just want to use this?

This code is [MIT licensed](https://raw.githubusercontent.com/Pomax/lib-font/master/LICENSE), do whatever you want with it.
