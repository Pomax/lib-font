import { SimpleTable } from "./tables/simple-table.js";
import lazy from "../lazy.js";

const brotliDecode = globalThis.unbrotli;
let nativeBrotliDecode = undefined;

if (!brotliDecode) {
  import("zlib").then((zlib) => {
    nativeBrotliDecode = (buffer) => zlib.brotliDecompressSync(buffer);
  });
}

/**
 * The WOFF2 header
 *
 * See https://www.w3.org/TR/WOFF2 for WOFF2 information
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/overview for font information
 */
class WOFF2 extends SimpleTable {
  constructor(font, dataview, createTable) {
    const { p } = super({ offset: 0, length: 48 }, dataview, `woff2`);
    this.signature = p.tag;
    this.flavor = p.uint32;
    this.length = p.uint32;
    this.numTables = p.uint16;
    p.uint16; // why woff2 even has any reserved bytes is a complete mystery. But it does.
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
    this.directory = [...new Array(this.numTables)].map(
      (_) => new Woff2TableDirectoryEntry(p)
    );
    let dictOffset = p.currentPosition; // = start of CompressedFontData block

    // compute table byte offsets in the decompressed data
    this.directory[0].offset = 0;
    this.directory.forEach((e, i) => {
      let next = this.directory[i + 1];
      if (next) {
        next.offset =
          e.offset + (e.transformLength ? e.transformLength : e.origLength);
      }
    });

    // then decompress the original data and lazy-bind
    let buffer = dataview.buffer.slice(dictOffset);

    if (brotliDecode) {
      const decoded = brotliDecode(
        new Uint8Array(buffer)
      );
      buildWoff2LazyLookups(this, decoded, createTable);
    }

    else if (nativeBrotliDecode) {
      const decoded = new Uint8Array(nativeBrotliDecode(buffer));
      buildWoff2LazyLookups(this, decoded, createTable);
    }

    else {
      const msg = `no brotli decoder available to decode WOFF2 font`;
      if (font.onerror) font.onerror(msg);
    }
  }
}

/**
 * WOFF2 Table Directory Entry
 */
class Woff2TableDirectoryEntry {
  constructor(p) {
    this.flags = p.uint8;

    const tagNumber = (this.tagNumber = this.flags & 63);
    if (tagNumber === 63) {
      this.tag = p.tag;
    } else {
      this.tag = getWOFF2Tag(tagNumber);
    }

    /*
        "Bits 6 and 7 indicate the preprocessing transformation version number (0-3)
        that was applied to each table. For all tables in a font, except for 'glyf'
        and 'loca' tables, transformation version 0 indicates the null transform
        where the original table data is passed directly to the Brotli compressor
        for inclusion in the compressed data stream. For 'glyf' and 'loca' tables,
        transformation version 3 indicates the null transform"
    */
    const transformVersion = (this.transformVersion = (this.flags & 192) >> 6);
    let hasTransforms = transformVersion !== 0;
    if (this.tag === `glyf` || this.tag === `loca`) {
      hasTransforms = this.transformVersion !== 3;
    }

    this.origLength = p.uint128;
    if (hasTransforms) {
      this.transformLength = p.uint128;
    }
  }
}

/**
 * Build late-evaluating properties for each table in a
 * woff2 font, so that accessing a table via the
 * font.opentype.tables.tableName property kicks off
 * a table parse on first access.
 *
 * @param {*} woff2 the woff2 font object
 * @param {decoded} the original (decompressed) SFNT data
 * @param {createTable} the opentype table builder function
 */
function buildWoff2LazyLookups(woff2, decoded, createTable) {
  woff2.tables = {};
  woff2.directory.forEach((entry) => {
    lazy(woff2.tables, entry.tag.trim(), () => {
      const start = entry.offset;
      const end = start + (entry.transformLength ? entry.transformLength : entry.origLength);
      const data = decoded.slice(start, end);
      return createTable(
        woff2.tables,
        { tag: entry.tag, offset: 0, length: entry.origLength },
        new DataView(data.buffer)
      );
    });
  });
}

/**
 * WOFF2 uses a numbered tag registry, such that only unknown tables require a 4 byte tag
 * in the WOFF directory entry struct. Everything else uses a uint8. Nice and tidy.
 * @param {*} flag
 */
function getWOFF2Tag(flag) {
  return [
    `cmap`,
    `head`,
    `hhea`,
    `hmtx`,
    `maxp`,
    `name`,
    `OS/2`,
    `post`,
    `cvt `,
    `fpgm`,
    `glyf`,
    `loca`,
    `prep`,
    `CFF `,
    `VORG`,
    `EBDT`,
    `EBLC`,
    `gasp`,
    `hdmx`,
    `kern`,
    `LTSH`,
    `PCLT`,
    `VDMX`,
    `vhea`,
    `vmtx`,
    `BASE`,
    `GDEF`,
    `GPOS`,
    `GSUB`,
    `EBSC`,
    `JSTF`,
    `MATH`,
    `CBDT`,
    `CBLC`,
    `COLR`,
    `CPAL`,
    `SVG `,
    `sbix`,
    `acnt`,
    `avar`,
    `bdat`,
    `bloc`,
    `bsln`,
    `cvar`,
    `fdsc`,
    `feat`,
    `fmtx`,
    `fvar`,
    `gvar`,
    `hsty`,
    `just`,
    `lcar`,
    `mort`,
    `morx`,
    `opbd`,
    `prop`,
    `trak`,
    `Zapf`,
    `Silf`,
    `Glat`,
    `Gloc`,
    `Feat`,
    `Sill`,
  ][flag & 63];
}

export { WOFF2 };
