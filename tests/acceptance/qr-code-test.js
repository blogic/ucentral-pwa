import { module, test } from "qunit";
import { visit, currentURL } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import { setupMirage } from "ember-cli-mirage/test-support";
import {
  authenticateSession,
  invalidateSession,
} from "ember-simple-auth/test-support";
import ENV from "ucentral/config/environment";

module("Acceptance | qr-code", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  module("when th session is not authenticated", function (hooks) {
    hooks.beforeEach(async function () {
      await invalidateSession();
    });

    test("user is redirected to /auth", async function (assert) {
      await visit("/qr-code");

      assert.equal(currentURL(), "/auth");
    });
  });

  module("when the session is authenticated", function (hooks) {
    hooks.beforeEach(async function () {
      await authenticateSession({ serialNumber: "AAAA-CCCC" });
      this.server.get(
        `${ENV.APP.BASE_API_URL}/api/v1/device/AAAA-CCCC`,
        function () {
          return {
            configuration: {
              ssid: "the-ssid",
              password: "mypass",
              encryption: "wpa2",
              hidden: true,
            },
          };
        }
      );
    });

    test("route is accessible", async function (assert) {
      await visit("/qr-code");

      assert.equal(currentURL(), "/qr-code");
    });

    test("the correct network settings are rendered", async function (assert) {
      await visit("/qr-code");

      assert.dom("[data-test-layout-description]").containsText("the-ssid");
    });

    test("the QR code is rendered", async function (assert) {
      await visit("/qr-code");

      assert.dom("[data-test-qr-code]").exists();
    });
  });
});
