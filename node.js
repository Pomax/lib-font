import './FontNode.js';
import express from 'express';
import fs from 'fs';
import http from 'http';
import bodyParser from 'body-parser';

const myApp = express();
const mimetype = {
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.css': 'text/css',
	'.txt': 'text/plain',
	'.jpg': 'image/jpeg',
	'.gif': 'image/gif',
	'.bmp': 'image/bmp',
	'.png': 'image/png',
	'.svg': 'image/svg+xml',
	'.ico': 'image/x-icon',
	'.ttf': 'application/x-font-ttf',
	'.woff': 'application/x-font-woff',
	'.woff2': 'text/plain',
	'.fon': 'application/octet-stream',
	'.ogv': 'application/ogg',
	'.wav': 'audio/mpeg',
	'.mp3': 'audio/mpeg',
	'.ogg': 'audio/ogg'
};
myApp.use(bodyParser.urlencoded({
	extended: true
}));
myApp.use(bodyParser.json());

process.env.TZ = 'Europe/Amsterdam';

myApp.get('/fonts/*', (req, resp) => {
	const requestUrl = req.url.substring(1);
	const ext = requestUrl.replace(/^.*(?=\.)/, '');
	const mime = mimetype[ext] || 'text/html';
	fs.readFile(`${requestUrl}`, (error, data) => {
		console.log(data);
		resp.writeHead(200, {
			'Content-Type': mime
		});
		resp.end(data);
	});
});

myApp.get('*', (req, resp) => {
	const requestUrl = req.url.substring(1);
	const name = requestUrl.replace(/^.*\/(.*?)(?:\..*?)?$/, '$1');
	const font = new FontNode(name);
	font.src = `fonts/${requestUrl}`;
	font.onload = e => {
		console.log(e.detail.font);
		const name = e.detail.font.opentype.tables.name;

		// Get variable axes data
		let axes = "";
		const fvar = e.detail.font.opentype.tables.fvar;
		console.log(name);
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
	};
	font.onerror = e => {
		console.error(e);
	};
	resp.end('Hi!');
});

const httpServer = http.createServer(myApp);
httpServer.listen(process.env.PORT || 8080);
