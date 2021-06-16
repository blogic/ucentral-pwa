import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, fillIn, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl, t } from "ember-intl/test-support";
import { Response } from "miragejs";
import ENV from "ucentral/config/environment";

module(
  "Integration | Component | NetworkSettings::NetworkPasswordForm",
  function (hooks) {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function () {
      const currentDeviceService = this.owner.lookup("service:currentDevice");
      currentDeviceService.data = {
        serialNumber: "1111-AAAA-BBBB",
        name: "Test Dummy",
      };
    });

    test("request is sent with correct serial number", async function (assert) {
      assert.expect(1);

      await render(hbs`<NetworkSettings::NetworkPasswordForm />`);

      assert.dom("[data-test-layout-description]").hasText("Test Dummy");
    });

    test("request is sent with correct serial number", async function (assert) {
      assert.expect(1);
      this.server.post(
        `${ENV.APP.BASE_API_URL}/api/v1/device/:serialNumber/configure`,
        function (schema, request) {
          assert.equal(request.params.serialNumber, "1111-AAAA-BBBB");
        }
      );

      await render(hbs`<NetworkSettings::NetworkPasswordForm />`);
      await click("[data-test-confirm-button]");
    });

    test("request receives password in payload", async function (assert) {
      assert.expect(1);

      this.server.post(
        `${ENV.APP.BASE_API_URL}/api/v1/device/:serialNumber/configure`,
        function (schema, request) {
          assert.deepEqual(JSON.parse(request.requestBody), {
            configuration: {
              password: "New Password",
              currentPassword: "Old Password",
            },
          });
        }
      );

      await render(hbs`<NetworkSettings::NetworkPasswordForm />`);
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
    });

    test("when new password and repeat don't match then an error is shown", async function (assert) {
      assert.expect(2);
      this.server.post(
        `${ENV.APP.BASE_API_URL}/api/v1/device/:serialNumber/configure`,
        function () {
          return new Response(400, {}, {});
        }
      );

      await render(hbs`<NetworkSettings::NetworkPasswordForm />`);
      await fillIn(
        "[data-test-network-password] [data-test-password-input]",
        "New Password"
      );
      await fillIn(
        "[data-test-network-password-repeat] [data-test-password-input]",
        "Not matching"
      );
      await click("[data-test-confirm-button]");

      assert
        .dom("[data-test-network-password] [data-test-password-error]")
        .hasText(
          t("network_settings.wifi_password.errors.password_not_matching")
        );
      assert
        .dom("[data-test-network-password-repeat] [data-test-password-error]")
        .hasText(
          t("network_settings.wifi_password.errors.password_not_matching")
        );
    });
  }
);
