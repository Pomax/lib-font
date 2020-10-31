// Known font header byte sequences
const TTF = [0x00, 0x01, 0x00, 0x00];
const OTF = [0x4f, 0x54, 0x54, 0x4f];  // "OTTO"
const WOFF = [0x77, 0x4f, 0x46, 0x46 ];  // "wOFF"
const WOFF2 = [0x77, 0x4f, 0x46, 0x32 ];  // "wOF2"

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
