const f = new Font("Testy");
// f.src = "Fit-Variable.woff2";
// f.src = "Gimlet_Italics-VF.ttf";

f.src = "Fraunces-VF.ttf";

f.onload = e => parsy(e);
f.onerror = e => console.error(e);

function parsy(e) {
	const font = e.detail.font;
	const name = font.opentype.tables.name;

	// Get variable axes data
	let axes = "";
	const fvar = font.opentype.tables.fvar;
	console.log(fvar);
	for (const axis of fvar.axes) {
		console.log(`${axis.tag} = ${name.get(axis.axisNameID)}, ${axis.defaultValue}`)
	}
	console.log(fvar.getSupportedAxes());

	console.log("============================");

	// Get character set
	const cmap = font.opentype.tables.cmap;
	console.log(cmap);
	console.log(cmap.getSupportedEncodings());
	console.log(cmap.getSupportedCharCodes(0, 3));



	// let charset = "";
	// // const chars = e.detail.font.opentype.tables.cmap.get(1);
	// console.log(e.detail.font.opentype.tables.cmap.encodingRecords.map(r => r.table.getSupportedCharCodes()));
	// for (let i = 0; i < 65535; i++) {
	// 	const char = String.fromCharCode(i);
	// 	if (chars.supports(char) !== false) {
	// 		// charset += `- &amp;#${i};\n`;
	// 		charset += `- "&amp;#${i};"\n`;
	// 	}
	// }
	// document.querySelector(".charset").innerHTML = charset;
}
