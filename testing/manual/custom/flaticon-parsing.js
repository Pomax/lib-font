import { Font } from "../../../lib-font.js";

const font = new Font("flaticon");
font.onload = (evt) => {
  try { testFont(evt.detail.font); }
  catch (e) { console.error(e); }
};

font.src = "./fonts/proprietary/helvetica.woff";

function testFont(font) {
  const { directory, tables } = font.opentype;

  const { name } = tables;
  name.nameRecords.forEach((record) => {
    const str = record.string;
    console.log(str);
  });
}
