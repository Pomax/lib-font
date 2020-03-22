// Step 1: set up a namespace for all our table classes.
const tableClasses = {};
let tableClassesLoaded = false;

// Step 2: load all the table classes. While the imports
// all resolve asynchronously, Promise.all won't "exit"
// until every class definition has been loaded.
Promise.all([
    // opentype tables
    import("./simple/cmap.js"),
    import("./simple/head.js"),
    import("./simple/hhea.js"),
    import("./simple/hmtx.js"),
    import("./simple/maxp.js"),
    import("./simple/name.js"),
    import("./simple/OS2.js"),
    import("./simple/post.js"),

    // opentype tables that rely on the "common layout tables" data structures
    import("./advanced/BASE.js"),
    import("./advanced/GDEF.js"),
    import("./advanced/GSUB.js"),
    import("./advanced/GPOS.js"),

    // SVG tables... err... table
    import("./simple/SVG.js"),

    // Variable fonts
    import("./simple/variation/fvar.js"),

    // TTF tables
    import("./simple/ttf/cvt.js"),
    import("./simple/ttf/fpgm.js"),
    import("./simple/ttf/gasp.js"),
    import("./simple/ttf/glyf.js"),
    import("./simple/ttf/loca.js"),
    import("./simple/ttf/prep.js"),

    // CFF
    import("./simple/cff/CFF.js"),
    import("./simple/cff/CFF2.js"),
    import("./simple/cff/VORG.js"),

    // bitmap
    import("./simple/bitmap/EBLC.js"),
    import("./simple/bitmap/EBDT.js"),
    import("./simple/bitmap/EBSC.js"),
    import("./simple/bitmap/CBLC.js"),
    import("./simple/bitmap/CBDT.js"),
    import("./simple/bitmap/sbix.js"),

    // "other" tables
    import("./simple/other/DSIG.js"),
    import("./simple/other/hdmx.js"),
    import("./simple/other/kern.js"),
    import("./simple/other/LTSH.js"),
    import("./simple/other/MERG.js"),
    import("./simple/other/meta.js"),
    import("./simple/other/PCLT.js"),
    import("./simple/other/VDMX.js"),
    import("./simple/other/vhea.js"),
    import("./simple/other/vmtx.js"),
])

// Step 3: rebind all the class imports so that
// we can fetch constructors given table names.
.then(data => {
    data.forEach(e => {
        let name = Object.keys(e)[0];
        tableClasses[name] = e[name];
    });
    tableClassesLoaded = true;
});

/**
 * Step 4: set up a table factory that can build tables given a name tag.
 * @param {*} tables the object containing actual table instances.
 * @param {*} dict an object of the form: { tag: "string", offset: <number>, [length: <number>]}
 * @param {*} dataview a DataView object over an ArrayBuffer of Uint8Array
 */
function createTable(tables, dict, dataview) {
    let name = dict.tag.replace(/[^\w\d]/g,``);
    let Type = tableClasses[name];
    if (Type) return new Type(dict, dataview, tables);
    console.warn(`Font.js has no definition for ${name}. The table was skipped.`);
    return {};
};

function loadTableClasses() {
    let count = 0;
    function checkLoaded(resolve, reject) {
        if (!tableClassesLoaded) {
            if (count > 10) {
                return reject(new Error(`loading took too long`));
            }
            count++;
            return setTimeout(() => checkLoaded(resolve), 250);
        }
        resolve(createTable);
    }
    return new Promise((resolve, reject) => checkLoaded(resolve));
}

export { loadTableClasses };
