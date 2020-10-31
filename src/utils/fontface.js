/**
 * Guess the font's CSS "format" by analysing the asset path.
 */
function getFontCSSFormat(path, errorOnStyle) {
  let pos = path.lastIndexOf(`.`);
  let ext = (path.substring(pos + 1) || ``).toLowerCase();

  let format = {
    ttf: `truetype`,
    otf: `opentype`,
    woff: `woff`,
    woff2: `woff2`,
  }[ext];

  if (format) return format;

  let msg = {
    eot: `The .eot format is not supported: it died in January 12, 2016, when Microsoft retired all versions of IE that didn't already support WOFF.`,
    svg: `The .svg format is not supported: SVG fonts (not to be confused with OpenType with embedded SVG) were so bad we took the entire fonts chapter out of the SVG specification again.`,
    fon: `The .fon format is not supported: this is an ancient Windows bitmap font format.`,
    ttc: `Based on the current CSS specification, font collections are not (yet?) supported.`,
  }[ext];

  if (!msg) msg = `${path} is not a known webfont format.`;

  if (errorOnStyle) {
    // hard stop if the user wants stylesheet errors to count as true errors,
    throw new Error(msg);
  } else {
    // otherwise, only leave a warning in the output log.
    console.warn(`Could not load font: ${msg}`);
  }
}

/**
 * Create an @font-face stylesheet for browser use.
 */
async function setupFontFace(name, url, options = {}) {
  if (!globalThis.document) return;

  let format = getFontCSSFormat(url, options.errorOnStyle);
  if (!format) return;

  let style = document.createElement(`style`);
  style.className = `injected by Font.js`;

  let rules = [];
  if (options.styleRules) {
    rules = Object.entries(options.styleRules).map(
      ([key, value]) => `${key}: ${value};`
    );
  }

  style.textContent = `
@font-face {
    font-family: "${name}";
    ${rules.join(`\n\t`)}
    src: url("${url}") format("${format}");
}`;
  globalThis.document.head.appendChild(style);
  return style;
}

export { setupFontFace };
