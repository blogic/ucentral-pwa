import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, fillIn, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl, t } from "ember-intl/test-support";
import { Response } from "miragejs";
import ENV from "ucentral/config/environment";

module(
  "Integration | Component | NetworkSettings::NetworkNameForm",
  function (hooks) {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function () {
      const currentDeviceService = this.owner.lookup("service:currentDevice");
      currentDeviceService.data = { serialNumber: "1111-AAAA-BBBB" };
    });

    test("it shows current device name as value by default", async function (assert) {
      const currentDeviceService = this.owner.lookup("service:currentDevice");
      currentDeviceService.data = {
        configuration: { ssid: "Default device name" },
      };

      await render(hbs`<NetworkSettings::NetworkNameForm />`);
      assert
        .dom("[data-test-network-name] [data-test-input]")
        .hasValue("Default device name");
    });

    test("request is sent with correct serial number", async function (assert) {
      assert.expect(1);
      this.server.post(
        `${ENV.APP.BASE_API_URL}/api/v1/device/:serialNumber/configure`,
        function (schema, request) {
          assert.equal(request.params.serialNumber, "1111-AAAA-BBBB");
        }
      );

      await render(hbs`<NetworkSettings::NetworkNameForm />`);
      await click("[data-test-confirm-button]");
    });

    test("request receives ssid in payload", async function (assert) {
      assert.expect(1);

      this.server.post(
        `${ENV.APP.BASE_API_URL}/api/v1/device/:serialNumber/configure`,
        function (schema, request) {
          assert.deepEqual(JSON.parse(request.requestBody), {
            configuration: { ssid: "New SSID" },
          });
        }
      );

      await render(hbs`<NetworkSettings::NetworkNameForm />`);
      await fillIn("[data-test-network-name] [data-test-input]", "New SSID");
      await click("[data-test-confirm-button]");
    });

    test("when request fails it shows an error message", async function (assert) {
      assert.expect(2);
      this.server.post(
        `${ENV.APP.BASE_API_URL}/api/v1/device/:serialNumber/configure`,
        function () {
          return new Response(400, {}, {});
        }
      );

      await render(hbs`<NetworkSettings::NetworkNameForm />`);
      await click("[data-test-confirm-button]");

      assert.dom("[data-test-network-name] [data-test-input]").exists();
      assert
        .dom("[data-test-network-name] [data-test-input-error]")
        .hasText(t("errors.somethingWentWrong"));
    });
  }
);
