Font.js - lifting the hood on your fonts
===

If you're looking for the (really) old version of Font.js, [go here](https://github.com/Pomax/Font.js/tree/v2015).

With that out of the way: what if you could actually inspect your web fonts? In the same context that you actually _use_ those web fonts?

That's what this is for:

```js
// Create a font object
const myFont = new Font(`Adobe Source Code Pro`);

// Assign event handling (.addEventListener version supported too, of course)
myFont.onerror = console.error;
myFont.onload = doSomeFontThings(evt);

// Kick off the font load by setting a source file
myFont.src = `./test/SourceCodePro-Regular.otf`;

// When the font's up and loaded in, let's do some testing!
function doSomeFontThings(evt) {
    const font = evt.font;

    // First, let's test some characters:
    [`a`, `→`, `嬉`].forEach(char => console.log(`Font supports '${char}': ${
        font.supports(char)
    }`));

    // Then, let's figure out which writing scripts this font supports.
    console.log(`This font supports the following scripts: ${
        font.tables.GSUB.scriptList.getSupportedScripts()
    }`);

    // DFLT is a given, but let's see if `latn` has any special language/system rules...
    console.log(`Special langsys for 'latn': ${
        font.tables.GSUB.scriptList.getTable('latn').getSupportedLangSys()
    }`);

    // Wow, "Northern Sami" support? Really? Which OpenType features does that use?
    console.log(`OpenType features for the Northern Sami version of latin script:`,
        font.tables.GSUB.scriptList.getTable('latn').getLangSys("NSM ").getFeatures()
    );
}
```