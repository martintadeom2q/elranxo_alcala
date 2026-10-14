import { defineConfig } from 'vite';
import { renderSite } from './src/template.ts';

export default defineConfig({
  plugins: [{
    name: 'ranxo-static-content',
    transformIndexHtml(html) {
      return html.replace('<div id="app"></div>', `<div id="app">${renderSite()}</div>`);
    },
  }],
});
