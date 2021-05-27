"use strict";

module.exports = {
  extends: "stylelint-config-standard",
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen",
          "layer",
        ],
      },
    ],
    "property-no-unknown": [
      true,
      {
        ignoreProperties: ["composes"],
      },
    ],
  },
};
