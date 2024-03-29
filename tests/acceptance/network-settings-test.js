import { module, test } from "qunit";
import { visit, currentURL, click, fillIn } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import { setupMirage } from "ember-cli-mirage/test-support";
import {
  authenticateSession,
  invalidateSession,
} from "ember-simple-auth/test-support";
import ENV from "ucentral/config/environment";

module("Acceptance | network-settings", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test("visiting /network-settings", async function (assert) {
    await authenticateSession();
    await visit("/network-settings");

    assert.equal(currentURL(), "/network-settings");
  });

  test("when not authenticated, redirects to /auth", async function (assert) {
    await invalidateSession();
    await visit("/network-settings");

    assert.equal(currentURL(), "/auth");
  });

  test("network map link on 'dashboard' redirects to 'network-settings", async function (assert) {
    await authenticateSession({ serialNumber: "configured-serial" });
    await visit("/");

    await click("[data-test-button-edit-settings]");

    assert.equal(currentURL(), "/network-settings");
  });

  test("when a back button is clicked it redirects to 'dashboard'", async function (assert) {
    await authenticateSession({ serialNumber: "configured-serial" });
    await visit("/network-settings");

    await click("[data-test-button-back]");

    assert.equal(currentURL(), "/");
  });

  test("when 'change network name' is clicked it redirects to network-settings.network-name", async function (assert) {
    await authenticateSession({ serialNumber: "configured-serial" });
    await visit("/network-settings");

    await click("[data-test-button-network-name]");

    assert.equal(currentURL(), "/network-settings/network-name");
  });

  test("when on 'change network name' and back button is clicked it redirects to 'network-settings", async function (assert) {
    await authenticateSession({ serialNumber: "configured-serial" });
    await visit("/network-settings/network-name");

    await click("[data-test-button-back]");

    assert.equal(currentURL(), "/network-settings");
  });

  test("when network name change succeeds it redirects to 'network-settings", async function (assert) {
    this.server.post(
      `${ENV.APP.BASE_API_URL}/api/v1/device/:serialNumber/configure`,
      function () {
        return new Response(200, {}, {});
      }
    );
    await authenticateSession({ serialNumber: "configured-serial" });
    await visit("/network-settings/network-name");
    await fillIn(
      "[data-test-network-name] [data-test-input]",
      "New network name"
    );

    await click("[data-test-confirm-button]");

    assert.equal(currentURL(), "/network-settings/success");
  });

  test("when 'change network password' is clicked it redirects to network-settings.network-password", async function (assert) {
    await authenticateSession({ serialNumber: "configured-serial" });
    await visit("/network-settings");

    await click("[data-test-button-network-password]");

    assert.equal(currentURL(), "/network-settings/network-password");
  });

  test("when on 'change network password' and back button is clicked it redirects to 'network-settings", async function (assert) {
    await authenticateSession({ serialNumber: "configured-serial" });
    await visit("/network-settings/network-password");

    await click("[data-test-button-back]");

    assert.equal(currentURL(), "/network-settings");
  });

  test("when password change succeeds it redirects to 'network-settings", async function (assert) {
    this.server.post(
      `${ENV.APP.BASE_API_URL}/api/v1/device/:serialNumber/configure`,
      function () {
        return new Response(200, {}, {});
      }
    );
    await authenticateSession({ serialNumber: "configured-serial" });
    await visit("/network-settings/network-password");
    await fillIn(
      "[data-test-network-password-current] [data-test-password-input]",
      "Old Password"
    );
    await fillIn(
      "[data-test-network-password] [data-test-password-input]",
      "New Password"
    );
    await fillIn(
      "[data-test-network-password-repeat] [data-test-password-input]",
      "New Password"
    );

    await click("[data-test-confirm-button]");

    assert.equal(currentURL(), "/network-settings/success");
  });
});
