import { module, test } from "qunit";
import { visit, currentURL, fillIn, click } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";

import AuthService from "ucentral/services/auth";

const createAuthServiceStub = (loginStub) =>
  class AuthServiceStub extends AuthService {
    login = loginStub;
  };

module("Acceptance | authentication", function (hooks) {
  setupApplicationTest(hooks);

  test("user is redirected to /auth when not authenticated", async function (assert) {
    await visit("/");

    assert.equal(currentURL(), "/auth");
  });

  test("given user entered correct credentials they are redirected to /dashboard", async function (assert) {
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
