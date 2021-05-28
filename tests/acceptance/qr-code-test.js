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
  });
});
