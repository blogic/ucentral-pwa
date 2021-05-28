import { module, test } from "qunit";
import { visit, currentURL } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import { setupMirage } from "ember-cli-mirage/test-support";
import {
  authenticateSession,
  invalidateSession,
} from "ember-simple-auth/test-support";

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

  module("when th session is authenticated", function (hooks) {
    hooks.beforeEach(async function () {
      await authenticateSession();
    });

    test("route is accessible", async function (assert) {
      await visit("/qr-code");

      assert.equal(currentURL(), "/qr-code");
    });

    test("the correct network settings are rendered", async function (assert) {
      this.get("/network-settings", function () {
        return new Response(
          400,
          { "content-type": "application/json" },
          {
            ssid: "mynetwork",
            password: "mypass",
            encryption: "wpa2",
            hidden: false,
          }
        );
      });
      await visit("/qr-code");

      assert.dom("[data-test-layout-description]").containsText("mynetwork");
    });
  });
});
