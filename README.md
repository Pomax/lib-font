# Font.js - lifting the hood on your fonts


If you're looking for the (really) old version of Font.js, [go here](https://github.com/Pomax/Font.js/tree/v2015).

With that out of the way: what if you could actually inspect your web fonts? In the same context that you actually _use_ those web fonts?

That's what this is for:

```js
// Create a font object
const myFont = new Font(`Adobe Source Code Pro`);

// When the font's up and loaded in, let's do some testing!
function doSomeFontThings(evt) {
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

// Assign event handling (.addEventListener version supported too, of course)
myFont.onerror = evt => console.error(evt);
myFont.onload = evt => doSomeFontThings(evt);

// Kick off the font load by setting a source file
myFont.src = `./fonts/SourceCodeVariable-Roman.otf.woff2`;
```

## Running this code

I'd recommend using the Node.js `live-server` package (`npm install live-server` after which it's `npx live-server`), which will start up a server _and_ open your browser to the server's index.html page, live-reloading whenever you change things in the code.

Barring that, you can of course use one of the many ways to fire up a quick http server:
- `http-server` (Node.js package)
- `python -m SimpleHTTPServer` (when still using python 2.7 - please stop using that btw) 
- `python -m http.server` (when using Python 3)
- `php -S localhost:8000` (if you happen to still have PHP installed)
- `ruby -run -e httpd . -p 8000` (ruby, obviously)


## Building this code

If you want to build this code for use in  the browser, you can use `rollup` (`npm install rollup`, after which it's `npx rollup`) to turn Font.js into a single file:

```bash
$ npx rollup --no-treeshaking --format=esm Font.js > Font.rolled.js
```

Note that this does not include the `inflate` and `unbrotli` libraries from the `./lib` directory: as optional dependencies, they're intentionally left out when you roll up the code. Without them, plain opentype parsing will still work perfectly fine, but woff and woff2 parsing obviously won't.

Also, if you wish to minify the rolled up version of Font.js, I would recommend using `babel-minify` (`npm install babel-minify` after which it's `npx minify font.rolled.js -d minified`). Again, this won't do antyhing to make the `inflate` or `unbrotli` libraries smaller, but it will reduce the size of Font.js to around 50% its original size.

## Compatibility

This library was designed specifically for use in the browser.

It won't work in Node right now, because Node doesn't have its own `window`, `document`, and Fetch API implementation, but most important: Node.js is absolutely stupid when it comes to loading es modules, and for some idiotic reason demands you call module files `.mjs` instead of just looking for ES import/export statements in `.js` files. And I'm not renaming every file to an `.mjs` extension...

## API

The API has not yet been fully settled on - right now a lot of it is fairly easy to find in the source, but that's the only place atm.

## Why don't woff/woff2 work?

They do, but they rely on having the gzip inflater and brotli decoder libraries loaded. You can find those in the `./lib` dir, as they are optional: without them regular parsing still works fine, but with `inflate` loaded, woff parsing will succeed, and with `unbrotli` loaded, woff2 parsing will succeed.

To make this work on your own pages, add the following bit to your document head, with the appropriate path to these two libraries, of course:

```html
    <script src="./lib/inflate.js" defer></script>
    <script src="./lib/unbrotli.js" defer></script>
```

## Why can't this draw stuff??

Because you already have a text shaping engine available: your browser. You can already draw all the text you need, properly shaped and typeset, both in HTML and on a Canvas. There is no reason for this library to try to do that, when it's guaranteed to do it worse.

## Why wouldn't I use OpenType.js, or Fontkit?

I don't have a good answer to that. Those are some great projects, you probably _should_ use them if they do what you need? The reason _I_ needed this is because it doesn't do text shaping: it just lets me query the opentype data to get me the information I need, without being too big of a library. And I've written enough OpenType parsers to know how much code goes into the actual shaping.

## Alright, what if I have opinions?

Tweet at me! [@TheRealPomax](http://twitter.com/TheRealPomax) or [@TheRealPomax@Mastodon.social](https://mastodon.social/@TheRealPomax) should do nicely, but if you want to have an in-depth discussion, I'd recommend filing an issue, since 280 characters per message is not really sufficient to dig into OpenType details.
