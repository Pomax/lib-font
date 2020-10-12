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

You can also pass in a file directly, e.g. using the [HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API). In that case, you'll need to use `fromDataBuffer` instead of `loadFont`, and pass the original filename explicity so that the type of font can be determined from the extension:

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

## Running this code

I'd recommend using the Node.js `live-server` package (`npm install live-server` after which it's `npx live-server`), which will start up a server _and_ open your browser to the server's index.html page, live-reloading whenever you change things in the code.

Barring that, you can of course use one of the many ways to fire up a quick http server:
- `http-server` (Node.js package)
- `python -m SimpleHTTPServer` (when still using python 2.7 - please stop using that btw)
- `python -m http.server` (when using Python 3)
- `php -S localhost:8000` (if you happen to still have PHP installed)
- `ruby -run -e httpd . -p 8000` (ruby, obviously)


## Building this code

While the whole point of ES modules is that you don't need to bundle anything, if you _want_ to turn Font.js into a single file, you can do so using `rollup` (`npm install rollup`, after which it's `npx rollup`):

```bash
$ npx rollup --no-treeshaking --format=esm Font.js > Font.rolled.js
```

Note that this does not include the `inflate` and `unbrotli` libraries from the `./lib` directory: as optional dependencies, they're intentionally left out when you roll up the code. Without them, plain opentype parsing will still work perfectly fine, but woff and woff2 parsing obviously won't.

Also, if you wish to minify the rolled up version of Font.js, I would recommend using `babel-minify` (`npm install babel-minify` after which it's `npx minify font.rolled.js -d minified`). Again, this won't do anything to make the `inflate` or `unbrotli` libraries smaller, but it will reduce the size of Font.js to around 50% its original size.

## Compatibility

This library was designed specifically for use in the browser, but will also run in any version of Node.js that has [esmodule]() support(v12 with feature flags, v14+ natively). Font.js can be imported using the `import` keyword, after which the rest of the code is effectively identical:

```js
import { Font } from "./Font.js";

const myfont = new Font("My Test Font");

myfont.onerror = evt => console.error(evt);

myfont.onload = function inspectThisFont(evt) {
    const font = evt.detail.font;
    const tables = font.opentype.tables;
    const name = tables.name;
    const fvar = tables.fvar;

    console.log(`fvar has ${fvar.axisCount} axes, at size ${fvar.axisSize}`)
    console.log(`fvar has ${fvar.instanceCount} instances:`)

    fvar.instances.forEach(i =>
        console.log(`subfamily: ${name.get(i.subfamilyNameID)}, postscriptname: ${name.get(i.postScriptNameID)}`)
    );
}

myfont.src = "./fonts/MySuperGreatFont-Regular-but-great.ttf";
```

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


## And if I just want to use this?

This code is [MIT licensed](https://raw.githubusercontent.com/Pomax/Font.js/master/LICENSE), do whatever you want with it.

## Node.js
Note that this script requires Node.js, which is best installed using the Node Version Manager (NVM).

### Installing Node on windows:
1. Install the latest nvm-windows.
2. In a command prompt, run nvm install latest, then nvm use latest.
3. Done

### Installing Node on something unixy:
1. Install nvm.
2. In a terminal, run nvm install latest, then nvm use latest.
3. Done

### Install font.js
To use Font.js in Node.js to load the information of a font file located on the server, run:
```bash
$ npm install
```
Create an example `font-node.js` file:
```js
import Font from 'font-js';

const filePath = './fonts/SourceCodePro-Regular.ttf';
const font = new Font('SourceCodePro-Regular');

font.onload = () => {
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
};

font.onerror = (error) => {
    console.log('ERROR!', error, '\n');
};

font.src = filePath;
```
Then run it:
```bash
$ node font-node
```