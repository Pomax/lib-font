import './FontNode.js';

const file = process.argv[2] || '';
if (file) {
	const name = file.replace(/^.*\/(.*?)(?:\..*?)$/, '$1');
	const font = new FontNode(name);
	font.src = file;
	font.onload = data => {
		console.log(data.detail.font);
	};
	font.onerror = err => {
		console.error(err)
	};
} else {
	console.error('Get a font by typing: node fondue [filename]')
}

