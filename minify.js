const minify = require('@node-minify/core');
const terser = require('@node-minify/terser');


minify({
  compressor: terser,
  input: 'src/embed.js',
  output: 'dist/bundle.js',
  callback: function(err, min) {}
});
