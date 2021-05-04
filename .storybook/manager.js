import { addons } from "@storybook/addons";

addons.setConfig({
  panelPosition: "right",
});


if (location.hostname.indexOf("localhost") === -1) {
  window.STORYBOOK_GA_ID = "UA-70842526-26";
  window.STORYBOOK_REACT_GA_OPTIONS = {};
}
