
// imready.js
// imready.min.js
// imready.pkgd.js
// imready.pkgd.min.js
// imready.esm.js


const buildHelper = require("@egjs/build-helper");
const name = "Grid";

export default buildHelper([
	{
		name,
		input: "./src/index.umd.ts",
		output: "./dist/grid.js",
		format: "umd",
		resolve: true,
	},
	{
		name,
		input: "./src/index.umd.ts",
		output: "./dist/grid.min.js",
		format: "umd",
		uglify: true,
		resolve: true,
	},
	{
		input: "./src/index.cjs.ts",
		output: "./dist/grid.cjs.js",
		format: "cjs",
		exports: "named",
	},
	{
		input: "./src/index.ts",
		output: "./dist/grid.esm.js",
		format: "esm",
		exports: "named",
	},
]);

