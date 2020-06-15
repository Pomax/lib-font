import path from 'path';
import './lib/inflate.js';
import './lib/unbrotli.js';
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
	return format;
}

fs.readFileAsync = (filename) => {
	return new Promise((resolve, reject) => {
		fs.readFile(filename, (err, data) => {
			if (err) reject(err);
			else resolve(data);
		});
	});
};

export default class FontNode extends Font {
	constructor(fileRaw, options = {}) {
		if (fileRaw) {
			const file = path.normalize(path.resolve(fileRaw)) || '';
			const name = file.replace(/^.*\/(.*?)(?:\..*?)$/, '$1');
			const font = super(name, options);
			font.src = file;
			return new Promise(function (resolve, reject) {
				font.onload = data => {
					resolve(data.detail.font);
				};
				font.onerror = error => {
					reject(error);
				};
			});
		}
	}

	set src(url) {
        this.__src = url;
        this.loadFont(url);
    }

	loadFont = (url) => {
		fs.readFileAsync(url)
			.then(buffer => new Uint8Array(buffer).buffer)
			.then(arrayBuffer => ({ arrayBuffer, type: getFontCSSFormat(url) }))
			.then(({ arrayBuffer, type }) => this.fromDataBuffer(arrayBuffer, type))
			.catch(error => {
				this.dispatch(error);
				if (this.onerror) this.onerror(error);
			});
	}
}
