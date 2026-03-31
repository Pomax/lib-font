import { Font } from "../../../lib-font.js";

const font = new Font("testfont");
font.src = "../../../fonts/IBMPlexSansThai-Light.ttf";

font.onload = (evt) => {
  let font = evt.detail.font;
  const { name } = font.opentype.tables;
  console.log(name, name.get(9));
};
