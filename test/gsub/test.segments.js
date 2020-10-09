// See https://github.com/Pomax/Font.js/pull/89#discussion_r498772951

import {
    heading,
    indent,
    unindent,
    assertEqual,
    assertNotEqual,
} from "../assert.js";

import { Font } from "../../Font.js";

let font = new Font("OpenSans Regular");
font.onload = () => {
    const cmap = font.opentype.tables.cmap;
    const cmap4 = cmap.getSubTable(0);
    console.log(cmap4.segments[0]);
    console.log(cmap4.segments[1]);
    console.log(cmap4.segments[2]);
    console.log(cmap4.segments[3]);
    console.log(cmap4.segments[4]);
};
font.src = `fonts/OpenSans/OpenSans-Regular.ttf`;
