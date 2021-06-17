import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import Service from "@ember/service";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";

module("Integration | Component | SetupSuccess", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    this.owner.register(
      "service:current-device",
      class MockCurrentDeviceService extends Service {
        data = {
          configuration: {
            ssid: "SSID",
            password: "my-secr0t!",
            encryption: "wpa2",
          },
        };
      }
    );
  });

  test("it renders the QR code", async function (assert) {
    await render(hbs`<SetupSuccess />`);

    assert.dom("[data-test-qr-code]").exists();
  });

  test("it renders a link to the dashboard", async function (assert) {
    await render(hbs`<SetupSuccess />`);

    assert.dom("[data-test-qr-code]").exists();
  });
});
