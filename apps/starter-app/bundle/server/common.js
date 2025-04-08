const path = require('path');
// const { copy } = require('esbuild-plugin-copy');
// const browserslist = require('browserslist');

// const DEFUNCT_BROWSERS_LIST_QUERY =
//   '<100%, not supports es6-module, dead, edge<19';

// Your CSS/JS build tool code
// const BROWSERS_LIST = browserslist(DEFUNCT_BROWSERS_LIST_QUERY);

const commonEsbuild = {
  entryPoints: [path.resolve(__dirname, '../../src/server.ts')],
  bundle: true,
  platform: 'node',
  minify: false,
  sourcemap: 'inline',
  target: ['ESNext'],
  // packages: 'external',
  // mainFields: ['module', 'main'],
  outfile: path.resolve(__dirname, '../../dist/server.js'),
  // define: {
  //   BROWSERS_LIST_CONFIG: JSON.stringify(BROWSERS_LIST),
  // },
  // plugins: [
  //   copy({
  //     // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
  //     // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
  //     resolveFrom: 'cwd',
  //     assets: {
  //       from: ['./src/static/**/*'],
  //       to: ['./dist/public/'],
  //     },
  //   }),
  // ],
};

module.exports = {
  commonEsbuild,
};
