const path = require("path");


module.exports = {
  webpackFinal: config => {
    const alias = config.resolve.alias;
    alias["@egjs/grid"] = path.resolve(__dirname, "../../../../dist/grid.esm.js");
    alias["vue"] = require.resolve("vue");
    alias["@storybook/vue"] = require.resolve("@storybook/vue3");

    return config;
  },
  "stories": [
    "../../stories/**/*.stories.mdx",
    "../../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs/register",
    "@storybook/addon-controls",
    "@storybook/addon-viewport/register",
    "storybook-addon-preview/register",
    "storybook-dark-mode/register",
  ],
}
