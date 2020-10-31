// Known font header byte sequences
const TTF = [0, 1, 0, 0];
const OTF = [`O`, `T`, `T`, `O`].map((v) => v.codePointAt(0));
const WOFF = [`w`, `O`, `F`, `F`].map((v) => v.codePointAt(0));
const WOFF2 = [`w`, `O`, `F`, `2`].map((v) => v.codePointAt(0));

/**
 * Array matching function
 */
function match(ar1, ar2) {
  if (ar1.length !== ar2.length) return;
  for (let i = 0; i < ar1.length; i++) {
    if (ar1[i] !== ar2[i]) return;
  }
  return true;
}

/**
 * verify a bytestream, based on the values we know
 * should be found at the first four bytes.
 */
function validFontFormat(dataview) {
  const LEAD_BYTES = [
    dataview.getUint8(0),
    dataview.getUint8(1),
    dataview.getUint8(2),
    dataview.getUint8(3),
  ];

  if (match(LEAD_BYTES, TTF) || match(LEAD_BYTES, OTF)) return `SFNT`;
  if (match(LEAD_BYTES, WOFF)) return `WOFF`;
  if (match(LEAD_BYTES, WOFF2)) return `WOFF2`;
}

export { validFontFormat };
