import { Font } from "../../../lib-font.js";

const font = new Font("SVG testing");
font.src = `./fonts/issue-127/Abelone-FREE.otf`;
font.onerror = (evt) => console.error(evt);
font.onload = (evt) => {
  const font = evt.detail.font;
  const { tables } = font.opentype;
  const SVGTable = tables["SVG"];

  console.log(SVGTable);
};
