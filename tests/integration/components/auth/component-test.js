import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, fillIn, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

import AuthService from "ucentral/services/auth";

const createAuthServiceStub = (loginStub) =>
  class AuthServiceStub extends AuthService {
    login = loginStub;
  };

module("Integration | Component | auth", function (hooks) {
  setupRenderingTest(hooks);

  test("auth service receives correct params when attempting login", async function (assert) {
    assert.expect(1);
    const authStub = createAuthServiceStub((params) =>
      assert.deepEqual(
        {
          ipAddress: "192.168.1.2",
          password: "Secret",
        },
        params
      )
    );
    this.owner.register("service:auth", authStub);

    await render(hbs`<Auth />`);

    await fillIn("[data-test-ip-address] [data-test-input]", "192.168.1.2");
    await click("[data-test-confirm-button]");

    await fillIn("[data-test-password] [data-test-password-input]", "Secret");
    await click("[data-test-confirm-button]");
  });

  test("shows error message when couldn't log-in", async function (assert) {
    assert.expect(1);
    const authStub = createAuthServiceStub(() => false);
    this.owner.register("service:auth", authStub);

    await render(hbs`<Auth />`);

    await fillIn("[data-test-ip-address] [data-test-input]", "192.168.1.2");
    await click("[data-test-confirm-button]");

    await fillIn("[data-test-password] [data-test-password-input]", "Secret");
    await click("[data-test-confirm-button]");

    assert
      .dom("[data-test-ip-address] [data-test-input-error]")
      .hasText("Incorrect IP Address or Password");
  });
});
