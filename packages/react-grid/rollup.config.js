const buildHelper = require("@egjs/build-helper");

const defaultOptions = {
    tsconfig: "tsconfig.build.json",
    sourcemap: true,
    name: "ReactGrid"
};
export default buildHelper([
    {
        ...defaultOptions,
        input: "./src/index.ts",
        exports: "named",
        format: "es",
        output: "./dist/grid.esm.js",
    },
    {
        ...defaultOptions,
        input: "./src/index.umd.ts",
        exports: "default",
        format: "cjs",
        output: "./dist/grid.cjs.js",
    },
    {
      ...defaultOptions,
      input: "./src/index.umd.ts",
      exports: "default",
      format: "umd",
      output: "./dist/grid.umd.js",
      external: {
        "@egjs/grid": "Grid",
        "react": "React",
      }
  },
]);
