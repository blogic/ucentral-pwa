"use strict";

module.exports = {
  extends: "octane",
  plugins: ["ember-template-lint-plugin-css-modules"],

  rules: {
    "no-bare-strings": true,
    "css-modules/static-local-class": true,
    "css-modules/no-class": true,
  },
};
