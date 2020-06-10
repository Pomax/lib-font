import './Font.js';

const f = new Font("Testy");

// f.src = "Fraunces-VF.ttf";
// f.onload = e => parsy(e);
// function parsy(e) {
// 	const font = e.detail.font;
// 	console.log(font);
// }

const oink = f.loadFont("/Users/roel/code/Font.js/Fraunces-VF.ttf");

// console.log(oink);

// setTimeout(() => {
// 	console.log(f.opentype.tables.name);
// 	console.log(f);
// }, 2000);