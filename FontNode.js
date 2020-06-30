import path from 'path';
import './lib/inflate.js';
import './lib/unbrotli.js';
import fs from 'fs'
const fsp = fs.promises;
import { Font as FontMain, getFontCSSFormat } from './Font.js';

class Font extends FontMain {
    constructor(name, options) {
      super(name, options);
    }
  
    set src(url) {
      this.__src = url;
      this.loadFile(url)
      .catch(error => {
        if (!this.onerror) throw error;
        this.onerror(error);
    })
    }
  
    async loadFile(url) {
      this.__src = url;
  
      const file = path.normalize(path.resolve(url));
  
      if (!file) {
        const err = new Error('FontNode error. File not found.')
        if (this.onerror) this.onerror(err);
        throw err;
      }
  
      const ext = path.extname(file);
  
      if (!ext) {
        const err = new Error('FontNode error. File extension is missing.')
        if (this.onerror) this.onerror(err);
        throw err;
      }
  
      const type = getFontCSSFormat(ext);
  
      if (!type) {
        const err = new Error('FontNode error. Unknown file type.')
        if (this.onerror) this.onerror(err);
        throw err;
      } 
  
      return fsp.readFile(url)
        .then(buffer => new Uint8Array(buffer).buffer)
        .then(arrayBuffer => this.fromDataBuffer(arrayBuffer, type));
    }
  }

export default Font;