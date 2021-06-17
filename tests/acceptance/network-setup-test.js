import { module, test } from "qunit";
import { visit, currentURL, click, fillIn } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import { setupMirage } from "ember-cli-mirage/test-support";
import {
  authenticateSession,
  invalidateSession,
} from "ember-simple-auth/test-support";
import ENV from "ucentral/config/environment";

module("Acceptance | network-setup", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test("when not authenticated, redirects to /auth", async function (assert) {
    await invalidateSession();
    await visit("/network-setup/new");

    assert.equal(currentURL(), "/auth");
  });

  test("is accssible when authenticated", async function (assert) {
    await authenticateSession();
    await visit("/network-setup/new");

    assert.equal(currentURL(), "/network-setup/new");
  });

  test("setting up a network works", async function (assert) {
    this.server.get(
      `${ENV.APP.BASE_API_URL}/api/v1/device/1111-AAAA-BBBB`,
      function () {
        return {
          configuration: "true",
          serialNumber: "1111-AAAA-BBBB",
          name: "Dummy",
        };
      }
    );
    this.server.post(
      `${ENV.APP.BASE_API_URL}/api/v1/device/1111-AAAA-BBBB/configure`,
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

    await authenticateSession({ serialNumber: "1111-AAAA-BBBB" });
    await visit("/network-setup/new");
    await fillIn("[data-test-network-name] [data-test-input]", "my-wifi");
    await click("[data-test-confirm-button]");
    await fillIn(
      "[data-test-network-password] [data-test-password-input]",
      "some password"
    );
    await click("[data-test-confirm-button]");

    assert.equal(currentURL(), "/network-setup/success");
  });

  test("the network-setup.success route transitions to index when no configuration is currently known", async function (assert) {
    await authenticateSession({ serialNumber: "1111-AAAA-BBBB" });
    this.server.get(
      `${ENV.APP.BASE_API_URL}/api/v1/device/1111-AAAA-BBBB`,
      function () {
        return {
          configuration: "true",
          serialNumber: "1111-AAAA-BBBB",
          name: "Dummy",
        };
      }
    );
    await visit("/network-setup/success");

    assert.equal(currentURL(), "/");
  });
});
