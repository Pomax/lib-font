// This is a Node.js script that loads a font and prints its name.
//
// Run it like this from the command line:
//
// $ node get-font-name.js
//
// It will use the "Recursive" test font in LibFont's ./fonts
// directory, but you can point it to a different font by
// providing the path to the font:
//
// $ node get-font-name.js path/to/font.ttf

// Import the LibFont library
import { Font } from "../lib-font.js";

// Create a LibFont object and give it a name
const font = new Font("My Font Name");

// Set the source font file. We use either the provided font, or
// the Recursive font from the test folder
font.src = process.argv[2] || "../fonts/Recursive_VF_1.064.ttf";

// Now we're ready to load the font and inspect it!
font.onload = (evt) => {
  // Map the details LibFont gathered from the font to the
  // "font" variable
  const font = evt.detail.font;

  // From all the OpenType tables in the font, take the "name"
  // table so we can inspect it further
  const { name } = font.opentype.tables;

  // From the name table, take the entry with ID "1". This is
  // the Font Family name. More info and names you can grab:
  // https://docs.microsoft.com/en-us/typography/opentype/spec/name
  const fontname = name.get(1);

  // Tell us the name!
  console.log(`This font is called ${fontname}.`);
}

// If for some reason the font fails to load or parse, throw
// an error
font.onerror = (evt) => {
  console.error(evt.msg);
}
