import { SimpleTable } from "../simple-table.js";

/**
 * The OpenType `post` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/post
 */
class post extends SimpleTable {
  constructor(dict, dataview) {
    const { p } = super(dict, dataview);

    this.version = p.legacyFixed;
    this.italicAngle = p.fixed;
    this.underlinePosition = p.fword;
    this.underlineThickness = p.fword;
    this.isFixedPitch = p.uint32;
    this.minMemType42 = p.uint32;
    this.maxMemType42 = p.uint32;
    this.minMemType1 = p.uint32;
    this.maxMemType1 = p.uint32;

    if (this.version === 1 || this.version === 3) return p.verifyLength();

    this.numGlyphs = p.uint16;

    if (this.version === 2) {
      this.glyphNameIndex = [...new Array(this.numGlyphs)].map((_) => p.uint16);

      // Note: we don't actually build `this.names` because it's a frankly bizarre
      // byte blob that encodes strings as "length-and-then-bytes" such that it
      // needs to be loaded entirely in memory before it's useful. That's fine for
      // printers, but is nuts for anything else.

      // Instead, we parse the data only enough to build a NEW type of lookup that
      // tells us which offset a glyph's name bytes are inside the names blob, with
      // the length of a name determined by offsets[next] - offsets[this].

      this.namesOffset = p.currentPosition;
      this.glyphNameOffsets = [1];

      for (let i = 0; i < this.numGlyphs; i++) {
        let index = this.glyphNameIndex[i];
        if (index < macStrings.length) {
          this.glyphNameOffsets.push(this.glyphNameOffsets[i]);
          continue;
        }
        let bytelength = p.int8;
        p.skip(bytelength);
        this.glyphNameOffsets.push(this.glyphNameOffsets[i] + bytelength + 1);
      }
    }

    if (this.version === 2.5) {
      this.offset = [...new Array(this.numGlyphs)].map((_) => p.int8);
    }
  }

  getGlyphName(glyphid) {
    if (this.version !== 2) {
      console.warn(
        `post table version ${this.version} does not support glyph name lookups`
      );
      return ``;
    }

    let index = this.glyphNameIndex[glyphid];
    if (index < 258) return macStrings[index];

    let offset = this.glyphNameOffsets[glyphid];
    let next = this.glyphNameOffsets[glyphid + 1];
    let len = next - offset - 1;
    if (len === 0) return `.notdef.`;

    this.parser.currentPosition = this.namesOffset + offset;
    const data = this.parser.readBytes(len, this.namesOffset + offset, 8, true);
    return data.map((b) => String.fromCharCode(b)).join(``);
  }
}

export { post };

const macStrings = [
  `.notdef`,
  `.null`,
  `nonmarkingreturn`,
  `space`,
  `exclam`,
  `quotedbl`,
  `numbersign`,
  `dollar`,
  `percent`,
  `ampersand`,
  `quotesingle`,
  `parenleft`,
  `parenright`,
  `asterisk`,
  `plus`,
  `comma`,
  `hyphen`,
  `period`,
  `slash`,
  `zero`,
  `one`,
  `two`,
  `three`,
  `four`,
  `five`,
  `six`,
  `seven`,
  `eight`,
  `nine`,
  `colon`,
  `semicolon`,
  `less`,
  `equal`,
  `greater`,
  `question`,
  `at`,
  `A`,
  `B`,
  `C`,
  `D`,
  `E`,
  `F`,
  `G`,
  `H`,
  `I`,
  `J`,
  `K`,
  `L`,
  `M`,
  `N`,
  `O`,
  `P`,
  `Q`,
  `R`,
  `S`,
  `T`,
  `U`,
  `V`,
  `W`,
  `X`,
  `Y`,
  `Z`,
  `bracketleft`,
  `backslash`,
  `bracketright`,
  `asciicircum`,
  `underscore`,
  `grave`,
  `a`,
  `b`,
  `c`,
  `d`,
  `e`,
  `f`,
  `g`,
  `h`,
  `i`,
  `j`,
  `k`,
  `l`,
  `m`,
  `n`,
  `o`,
  `p`,
  `q`,
  `r`,
  `s`,
  `t`,
  `u`,
  `v`,
  `w`,
  `x`,
  `y`,
  `z`,
  `braceleft`,
  `bar`,
  `braceright`,
  `asciitilde`,
  `Adieresis`,
  `Aring`,
  `Ccedilla`,
  `Eacute`,
  `Ntilde`,
  `Odieresis`,
  `Udieresis`,
  `aacute`,
  `agrave`,
  `acircumflex`,
  `adieresis`,
  `atilde`,
  `aring`,
  `ccedilla`,
  `eacute`,
  `egrave`,
  `ecircumflex`,
  `edieresis`,
  `iacute`,
  `igrave`,
  `icircumflex`,
  `idieresis`,
  `ntilde`,
  `oacute`,
  `ograve`,
  `ocircumflex`,
  `odieresis`,
  `otilde`,
  `uacute`,
  `ugrave`,
  `ucircumflex`,
  `udieresis`,
  `dagger`,
  `degree`,
  `cent`,
  `sterling`,
  `section`,
  `bullet`,
  `paragraph`,
  `germandbls`,
  `registered`,
  `copyright`,
  `trademark`,
  `acute`,
  `dieresis`,
  `notequal`,
  `AE`,
  `Oslash`,
  `infinity`,
  `plusminus`,
  `lessequal`,
  `greaterequal`,
  `yen`,
  `mu`,
  `partialdiff`,
  `summation`,
  `product`,
  `pi`,
  `integral`,
  `ordfeminine`,
  `ordmasculine`,
  `Omega`,
  `ae`,
  `oslash`,
  `questiondown`,
  `exclamdown`,
  `logicalnot`,
  `radical`,
  `florin`,
  `approxequal`,
  `Delta`,
  `guillemotleft`,
  `guillemotright`,
  `ellipsis`,
  `nonbreakingspace`,
  `Agrave`,
  `Atilde`,
  `Otilde`,
  `OE`,
  `oe`,
  `endash`,
  `emdash`,
  `quotedblleft`,
  `quotedblright`,
  `quoteleft`,
  `quoteright`,
  `divide`,
  `lozenge`,
  `ydieresis`,
  `Ydieresis`,
  `fraction`,
  `currency`,
  `guilsinglleft`,
  `guilsinglright`,
  `fi`,
  `fl`,
  `daggerdbl`,
  `periodcentered`,
  `quotesinglbase`,
  `quotedblbase`,
  `perthousand`,
  `Acircumflex`,
  `Ecircumflex`,
  `Aacute`,
  `Edieresis`,
  `Egrave`,
  `Iacute`,
  `Icircumflex`,
  `Idieresis`,
  `Igrave`,
  `Oacute`,
  `Ocircumflex`,
  `apple`,
  `Ograve`,
  `Uacute`,
  `Ucircumflex`,
  `Ugrave`,
  `dotlessi`,
  `circumflex`,
  `tilde`,
  `macron`,
  `breve`,
  `dotaccent`,
  `ring`,
  `cedilla`,
  `hungarumlaut`,
  `ogonek`,
  `caron`,
  `Lslash`,
  `lslash`,
  `Scaron`,
  `scaron`,
  `Zcaron`,
  `zcaron`,
  `brokenbar`,
  `Eth`,
  `eth`,
  `Yacute`,
  `yacute`,
  `Thorn`,
  `thorn`,
  `minus`,
  `multiply`,
  `onesuperior`,
  `twosuperior`,
  `threesuperior`,
  `onehalf`,
  `onequarter`,
  `threequarters`,
  `franc`,
  `Gbreve`,
  `gbreve`,
  `Idotaccent`,
  `Scedilla`,
  `scedilla`,
  `Cacute`,
  `cacute`,
  `Ccaron`,
  `ccaron`,
  `dcroat`,
];
