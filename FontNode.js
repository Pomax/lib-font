import './Font.js';
import fs from 'fs';

function getFontCSSFormat(pth) {
	let pos = pth.lastIndexOf(`.`);
	let ext = (pth.substring(pos + 1) || ``).toLowerCase();
	let format = {
		ttf: `truetype`,
		otf: `opentype`,
		woff: `woff`,
		woff2: `woff2`
	}[ext];

	if (format) return format;

	let msg = {
		eot: `The .eot format is not supported: it died in January 12, 2016, when Microsoft retired all versions of IE that didn't already support WOFF.`,
		svg: `The .svg format is not supported: SVG fonts (not to be confused with OpenType with embedded SVG) were so bad we took the entire fonts chapter out of the SVG specification again.`,
		fon: `The .fon format is not supported: this is an ancient Windows bitmap font format.`,
		ttc: `Based on the current CSS specification, font collections are not (yet?) supported.`
	}[ext];

	if (!msg) msg = `${url} is not a font.`;

	this.dispatch(new Event(`error`, {}, msg));
}

fs.readFileAsync = function (filename) {
	return new Promise(function (resolve, reject) {
		fs.readFile(filename, function (err, data) {
			if (err)
				reject(err);
			else
				resolve(data);
		});
	});
};

class FontNode extends Font {
	constructor(name, options = {}) {
		super(name, options);
	}

	loadFont = (url) => {
		const fsp = fs.promises;
		const type = getFontCSSFormat(url);
		fs.readFileAsync(`${process.cwd()}/${url}`)
			.then(buffer => new Uint8Array(buffer).buffer)
			.then(arrayBuffer => this.fromDataBuffer(arrayBuffer, type))
			.catch(err => { console.log(err); return `error ${err} Failed to load font at ${url}` });
	}
}

global.FontNode = FontNode;
