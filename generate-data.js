const f = new Font("Testy");
// f.src = "Fit-Variable.woff2";
// f.src = "Gimlet_Italics-VF.ttf";
f.src = "Fraunces-VF.ttf";

f.onload = e => parsy(e);
f.onerror = e => console.error(e);

function parsy(e) {
	console.log(e.detail.font);
	const name = e.detail.font.opentype.tables.name;

	// Get variable axes data
	let axes = "";
	const fvar = e.detail.font.opentype.tables.fvar;
	console.log(fvar);
// 	for (const axis of fvar.axes) {
// 		axes += `
// - axis: ${axis.tag}
//   name: ${name.get(axis.axisNameID)}
//   min: ${axis.minValue}
//   max: ${axis.maxValue}
//   default: ${axis.defaultValue}`;
// 	}
// 	document.querySelector(".axes").innerHTML = axes;

	// Get variable named instances
	// NOT POSSIBLE WITH FONT.JS YET

	// Get character set
	let charset = "";
	// const chars = e.detail.font.opentype.tables.cmap.get(1);
	console.log(e.detail.font.opentype.tables.cmap.encodingRecords.map(r => r.table.getSupportedCharCodes()));
	for (let i = 0; i < 65535; i++) {
		const char = String.fromCharCode(i);
		if (chars.supports(char) !== false) {
			// charset += `- &amp;#${i};\n`;
			charset += `- "&amp;#${i};"\n`;
		}
	}
	document.querySelector(".charset").innerHTML = charset;
}
