import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, fillIn, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import UcentralRouterAuthenticator from "ucentral/authenticators/ucentral-router";
import RSVP from "rsvp";
import { next } from "@ember/runloop";

const createAuthServiceStub = (loginStub) =>
  class UcentralRouterAuthenticatorStub extends UcentralRouterAuthenticator {
    authenticate = loginStub;
  };

module("Integration | Component | auth", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("auth service receives correct params when attempting login", async function (assert) {
    assert.expect(2);
    const authStub = createAuthServiceStub(async (userId, password) => {
      assert.equal(userId, "192.168.1.2");
      assert.equal(password, "Secret");
    });
    this.owner.register("authenticator:ucentral-router", authStub);

    await render(hbs`<Auth />`);

    await fillIn("[data-test-ip-address] [data-test-input]", "192.168.1.2");
    await click("[data-test-confirm-button]");

    await fillIn("[data-test-password] [data-test-password-input]", "Secret");
    await click("[data-test-confirm-button]");
  });

  test("shows error message when couldn't log-in", async function (assert) {
    assert.expect(1);
    const authStub = createAuthServiceStub(() => Promise.reject());
    this.owner.register("authenticator:ucentral-router", authStub);

    await render(hbs`<Auth />`);

    await fillIn("[data-test-ip-address] [data-test-input]", "192.168.1.2");
    await click("[data-test-confirm-button]");

    await fillIn("[data-test-password] [data-test-password-input]", "Secret");
    await click("[data-test-confirm-button]");

    assert
      .dom("[data-test-ip-address] [data-test-input-error]")
      .hasText("Incorrect IP Address or Password");
  });

  test("'next' button is disabled when ip address is not entered", async function (assert) {
    assert.expect(2);

    await render(hbs`<Auth />`);

    assert.dom("[data-test-ip-address] [data-test-input]").hasNoValue();
    assert.dom("[data-test-confirm-button]").hasAttribute("disabled");
  });

  test("'login' button is disabled when password is not entered", async function (assert) {
    assert.expect(2);

    await render(hbs`<Auth />`);
    await fillIn("[data-test-ip-address] [data-test-input]", "192.168.1.2");
    await click("[data-test-confirm-button]");

    assert.dom("[data-test-password] [data-test-password-input]").hasNoValue();
    assert.dom("[data-test-confirm-button]").hasAttribute("disabled");
  });

  test("'login' button is disabled when authentication request is in progress", async function (assert) {
    assert.expect(2);

    const deferred = RSVP.defer();
    const authStub = createAuthServiceStub(() => deferred.promise);
    this.owner.register("authenticator:ucentral-router", authStub);

    await render(hbs`<Auth />`);
    await fillIn("[data-test-ip-address] [data-test-input]", "192.168.1.2");
    await click("[data-test-confirm-button]");

    await fillIn("[data-test-password] [data-test-password-input]", "Secret");
    await click("[data-test-confirm-button]");

    next(() => {
      assert
        .dom("[data-test-confirm-button]")
        .hasAttribute("aria-pressed", "true");
      assert.dom("[data-test-confirm-button]").hasAttribute("disabled");
      deferred.resolve();
    });
  });
});
