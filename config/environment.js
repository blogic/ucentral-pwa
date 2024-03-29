"use strict";

module.exports = function (environment) {
  let ENV = {
    modulePrefix: "ucentral",
    environment,
    rootURL: "/",
    locationType: "auto",
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      BASE_API_URL: "https://ucentral.dpaas.arilia.com:16001",
    },

    "ember-cli-workbox": {
      enabled: false,
      debug: true,
      autoRegister: true,
    },
  };

  if (environment === "development") {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === "test") {
    // Testem prefers this...
    ENV.locationType = "none";

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = "#ember-testing";
    ENV.APP.autoboot = false;

    ENV.APP.BASE_API_URL = "http://localhost:4200";
  }

  if (environment === "production") {
    // here you can enable a production-specific feature
    ENV["ember-cli-mirage"] = {
      enabled: true,
    };
    ENV["ember-cli-workbox"] = {
      enabled: true,
      debug: false,
    };
  }

  return ENV;
};
