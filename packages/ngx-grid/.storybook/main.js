const path = require("path");

module.exports = {
  webpackFinal: config => {
    config.resolve.alias["@egjs/grid"] = path.resolve(__dirname, '../../../dist/grid.esm.js');

    return config;
  },
  "stories": [
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-controls/register",
    "@storybook/addon-viewport/register",
    "storybook-addon-preview/register",
    "storybook-dark-mode/register",
  ],
};
