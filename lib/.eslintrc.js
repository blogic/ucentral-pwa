const { devDependencies = {}, dependencies = {} } = require("../package.json");
const allowModules = [
  ...Object.keys(dependencies),
  ...Object.keys(devDependencies),
];

module.exports = {
  rules: {
    "node/no-extraneous-require": [
      "error",
      {
        allowModules,
      },
    ],
  },
};
