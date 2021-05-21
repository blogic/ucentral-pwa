import { module, test } from "qunit";
import { visit, currentURL, fillIn, click } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import { setupPretender } from "ucentral/tests/helpers/pretender";
import UcentralRouterAuthenticator from "ucentral/authenticators/ucentral-router";

const createAuthServiceStub = (loginStub) =>
  class UcentralRouterAuthenticatorStub extends UcentralRouterAuthenticator {
    authenticate = loginStub;
  };

module("Acceptance | authentication", function (hooks) {
  setupApplicationTest(hooks);
  setupPretender(hooks);

  test("user is redirected to /auth when not authenticated", async function (assert) {
    this.pretender.post("/authenticate", () => {
      assert.ok(true, "successfuly hit authenticate endpoint");
      return [200, {}, "{}"];
    });
    await visit("/");

    assert.equal(currentURL(), "/auth");
  });

  test("given user entered correct credentials they are redirected to /dashboard", async function (assert) {
    this.pretender.post("/authenticate", () => {
      return [200, {}, "{}"];
    });
    const authStub = createAuthServiceStub(async () => true);
    this.owner.register("service:auth", authStub);
    await visit("/");

    await fillIn("[data-test-ip-address] [data-test-input]", "192.168.1.2");
    await click("[data-test-confirm-button]");

    await fillIn("[data-test-password] [data-test-password-input]", "Secret");
    await click("[data-test-confirm-button]");

    assert.equal(currentURL(), "/");
  });

  test("given user entered incorrect credentials they are not redirected", async function (assert) {
    const authStub = createAuthServiceStub(async () => false);
    this.owner.register("service:auth", authStub);
    await visit("/");

    await fillIn("[data-test-ip-address] [data-test-input]", "192.168.1.2");
    await click("[data-test-confirm-button]");

    await fillIn("[data-test-password] [data-test-password-input]", "Secret");
    await click("[data-test-confirm-button]");

    assert.equal(currentURL(), "/auth");
  });
});
