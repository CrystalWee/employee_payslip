const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const json = require("rollup-plugin-json");
const { terser } = require("rollup-plugin-terser");

module.exports = {
  input: "src/index.js",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      exports: "named"
    }
  ],
  external: ["aws-sdk"],
  plugins: [
    resolve({
      preferBuiltins: true,
      mainFields: ["module", "main"]
    }),
    commonjs(),
    json(),
    terser()
  ]
};
