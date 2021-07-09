import { Font } from "../../../lib-font.js";

const font = new Font("flaticon");
font.onload = (evt) => testFont(evt.detail.font);
font.src = "./fonts/issue-114/Flaticon.woff2";

function testFont(font) {
  const { directory, tables } = font.opentype;

  const { name } = tables;
  name.nameRecords.forEach((record) => {
    const str = record.string;
    console.log(str);
  });
}
