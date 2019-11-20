const matrix = [
//    -      woff     woff2
    true,    true,    true,  // otf
    true,    true,    true,  // otf var
    true,    true,    true,  // ttf
    true,    true,    true,  // ttf var
];

const container = document.getElementById('matrix');

// OTF tests

if (matrix.shift()) {
    otf = new Font(`Adobe Source Code Pro (otf)`);
    otf.onerror = evt => console.error('otf error', evt)
    otf.onload = evt => {
        let font = evt.detail.font;
        let p = document.createElement('p');
        p.setAttribute('style', `font-family: "${font.name}";`);
        p.textContent = `Test line for ${font.name}`;
        container.appendChild(p);
        console.log(`loaded otf`);
    };
    otf.src = `./fonts/SourceCodePro-Regular.otf`;
}

if (matrix.shift()) {
    otfWoff = new Font(`Adobe Source Code Pro (otf woff)`);
    otfWoff.onerror = evt => console.error('otf.woff error', evt)
    otfWoff.onload = evt => {
        let font = evt.detail.font;
        let p = document.createElement('p');
        p.setAttribute('style', `font-family: "${font.name}";`);
        p.textContent = `Test line for ${font.name}`;
        container.appendChild(p);
        console.log(`loaded otf.woff`);
    };
    otfWoff.src = `./fonts/SourceCodePro-Regular.otf.woff`;
}

if (matrix.shift()) {
    otfWoff2 = new Font(`Adobe Source Code Pro (otf woff2)`);
    otfWoff2.onerror = evt => console.error('otf.woff2 error', evt)
    otfWoff2.onload = evt => {
        let font = evt.detail.font;
        let p = document.createElement('p');
        p.setAttribute('style', `font-family: "${font.name}";`);
        p.textContent = `Test line for ${font.name}`;
        container.appendChild(p);
        console.log(`loaded otf.woff2`);
    };
    otfWoff2.src = `./fonts/SourceCodePro-Regular.otf.woff2`;
}

// OTF variable font tests

if (matrix.shift()) {
    varOtf = new Font(`Adobe Source Code Pro (variable otf)`);
    varOtf.onerror = evt => console.error('otf (var) error', evt)
    varOtf.onload = evt => {
        let font = evt.detail.font;
        let p = document.createElement('p');
        p.setAttribute('style', `font-family: "${font.name}";`);
        p.textContent = `Test line for ${font.name}`;
        container.appendChild(p);
        console.log(`loaded otf (var)`);
    };
    varOtf.src = `./fonts/SourceCodeVariable-Roman.otf`;
}

if (matrix.shift()) {
    varOtfWoff = new Font(`Adobe Source Code Pro (variable otf woff)`);
    varOtfWoff.onerror = evt => console.error('otf.woff (var) error', evt)
    varOtfWoff.onload = evt => {
        let font = evt.detail.font;
        let p = document.createElement('p');
        p.setAttribute('style', `font-family: "${font.name}";`);
        p.textContent = `Test line for ${font.name}`;
        container.appendChild(p);
        console.log(`loaded otf.woff (var)`);
    };
    varOtfWoff.src = `./fonts/SourceCodeVariable-Roman.otf.woff`;
}

if (matrix.shift()) {
    varOtfWoff2 = new Font(`Adobe Source Code Pro (variable otf woff2)`);
    varOtfWoff2.onerror = evt => console.error('otf.woff2 (var) error', evt)
    varOtfWoff2.onload = evt => {
        let font = evt.detail.font;
        let p = document.createElement('p');
        p.setAttribute('style', `font-family: "${font.name}";`);
        p.textContent = `Test line for ${font.name}`;
        container.appendChild(p);
        console.log(`loaded otf.woff2 (var)`);
    };
    varOtfWoff2.src = `./fonts/SourceCodeVariable-Roman.otf.woff2`;
}

// TTF tests

if (matrix.shift()) {
    ttf = new Font(`Adobe Source Code Pro (ttf)`);
    ttf.onerror = evt => console.error('ttf error', evt)
    ttf.onload = evt => {
        let font = evt.detail.font;
        let p = document.createElement('p');
        p.setAttribute('style', `font-family: "${font.name}";`);
        p.textContent = `Test line for ${font.name}`;
        container.appendChild(p);
        console.log(`loaded ttf`);
    };
    ttf.src = `./fonts/SourceCodePro-Regular.ttf`;
}

if (matrix.shift()) {
    ttfWoff = new Font(`Adobe Source Code Pro (ttf woff)`);
    ttfWoff.onerror = evt => console.error('ttf.woff error', evt)
    ttfWoff.onload = evt => {
        let font = evt.detail.font;
        let p = document.createElement('p');
        p.setAttribute('style', `font-family: "${font.name}";`);
        p.textContent = `Test line for ${font.name}`;
        container.appendChild(p);
        console.log(`loaded ttf.woff`);
    };
    ttfWoff.src = `./fonts/SourceCodePro-Regular.ttf.woff`;
}

if (matrix.shift()) {
    ttfWoff2 = new Font(`Adobe Source Code Pro (ttf woff2)`);
    ttfWoff2.onerror = evt => console.error('ttf.woff2 error', evt)
    ttfWoff2.onload = evt => {
        let font = evt.detail.font;
        let p = document.createElement('p');
        p.setAttribute('style', `font-family: "${font.name}";`);
        p.textContent = `Test line for ${font.name}`;
        container.appendChild(p);
        console.log(`loaded ttf.woff2`);
    };
    ttfWoff2.src = `./fonts/SourceCodePro-Regular.ttf.woff2`;
}

// TTF variable font tests

if (matrix.shift()) {
    varTTf = new Font(`Adobe Source Code Pro (variable ttf)`);
    varTTf.onerror = evt => console.error('ttf (var)error', evt)
    varTTf.onload = evt => {
        let font = evt.detail.font;
        let p = document.createElement('p');
        p.setAttribute('style', `font-family: "${font.name}";`);
        p.textContent = `Test line for ${font.name}`;
        container.appendChild(p);
        console.log(`loaded ttf (var)`);
    };
    varTTf.src = `./fonts/SourceCodeVariable-Roman.ttf`;
}

if (matrix.shift()) {
    varTTfWoff = new Font(`Adobe Source Code Pro (variable ttf woff)`);
    varTTfWoff.onerror = evt => console.error('ttf.woff (var)error', evt)
    varTTfWoff.onload = evt => {
        let font = evt.detail.font;
        let p = document.createElement('p');
        p.setAttribute('style', `font-family: "${font.name}";`);
        p.textContent = `Test line for ${font.name}`;
        container.appendChild(p);
        console.log(`loaded ttf.woff (var)`);
    };
    varTTfWoff.src = `./fonts/SourceCodeVariable-Roman.ttf.woff`;
}

if (matrix.shift()) {
    varTTfWoff2 = new Font(`Adobe Source Code Pro (variable ttf woff2)`);
    varTTfWoff2.onerror = evt => console.error('ttf.woff2 (var) error', evt)
    varTTfWoff2.onload = evt => {
        let font = evt.detail.font;
        let p = document.createElement('p');
        p.setAttribute('style', `font-family: "${font.name}";`);
        p.textContent = `Test line for ${font.name}`;
        container.appendChild(p);
        console.log(`loaded ttf.woff2 (var)`);
    };
    varTTfWoff2.src = `./fonts/SourceCodeVariable-Roman.ttf.woff2`;
}



// Real testing

/*

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

*/
