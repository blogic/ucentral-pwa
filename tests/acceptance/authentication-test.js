import { module, test } from "qunit";
import { visit, currentURL, fillIn, click } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import { setupMirage } from "ember-cli-mirage/test-support";
import { invalidateSession } from "ember-simple-auth/test-support";
import { Response } from "miragejs";

module("Acceptance | authentication", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test("user is redirected to /auth when not authenticated", async function (assert) {
    await invalidateSession();

    await visit("/");

    assert.equal(currentURL(), "/auth");
  });

  test("given user entered correct credentials they are redirected to /dashboard", async function (assert) {
    this.server.post("/authenticate", () => {
      return new Response(200, {}, { succeeded: true });
    });
    await visit("/");

    await fillIn("[data-test-ip-address] [data-test-input]", "192.168.1.2");
    await click("[data-test-confirm-button]");

    await fillIn("[data-test-password] [data-test-password-input]", "Secret");
    await click("[data-test-confirm-button]");

    assert.equal(currentURL(), "/");
  });

  test("given user entered incorrect credentials they are not redirected", async function (assert) {
    this.server.post("/authenticate", () => {
      return new Response(400, {}, {});
    });

    await visit("/");

    await fillIn("[data-test-ip-address] [data-test-input]", "192.168.1.2");
    await click("[data-test-confirm-button]");

    await fillIn("[data-test-password] [data-test-password-input]", "Secret");
    await click("[data-test-confirm-button]");

    assert.equal(currentURL(), "/auth");
  });

  test("given authenticate endpoint failed to respond, they are not redirected", async function (assert) {
    await visit("/");

    await fillIn("[data-test-ip-address] [data-test-input]", "192.168.1.2");
    await click("[data-test-confirm-button]");

    await fillIn("[data-test-password] [data-test-password-input]", "Secret");
    await click("[data-test-confirm-button]");

    assert.equal(currentURL(), "/auth");
  });
});
