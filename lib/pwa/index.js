"use strict";

const Funnel = require("broccoli-funnel");
const mergeTrees = require("broccoli-merge-trees");

module.exports = {
  name: require("./package").name,

  isDevelopingAddon() {
    return true;
  },

  contentFor(type) {
    if (type === "head") {
      return `
        <link rel="manifest" href="/manifest.json">
        <meta name="theme-color" content="#ffffff"/>
        <link rel="apple-touch-icon" href="/assets/images/app-icons/512x512-bg.png">
      `;
    }
  },

  treeForPublic: function (tree) {
    var assetsTree = new Funnel("public");
    return mergeTrees([tree, assetsTree], {
      overwrite: true,
    });
  },
};
