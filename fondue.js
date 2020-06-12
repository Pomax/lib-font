import './FontNode.js';
import path from 'path';
import { LC } from './lib/log-color.js';

if (process.argv[2]) {
	const file = path.normalize(path.resolve(process.argv[2])) || '';
	const name = file.replace(/^.*\/(.*?)(?:\..*?)$/, '$1');
	const font = new FontNode(name);
	font.src = file;
	font.onload = data => {
		console.log(`${LC.magenta}*** Wakamai Fondue in Node ***${LC.reset}\n`, data.detail.font, '\n');
	};
	font.onerror = err => {
		console.error(`${LC.red}Could not load font.${LC.reset}\n${err}\n`)
	};
} else {
	console.warn(`${LC.blue}Get a font by typing: node fondue [filename]${LC.reset}\n`)
}

