import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, waitFor } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { Response } from "miragejs";
import ENV from "ucentral/config/environment";
import deviceWithStatusStyles from "ucentral/components/uc/device-with-status.css";

module("Integration | Component | NetworkMap::Detail", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  module("Access Point", function () {
    test("shows network health text", async function (assert) {
      this.server.get(
        `${ENV.APP.BASE_API_URL}/api/v1/device/:serialNumber`,
        function () {
          return new Response(400, {}, {});
        }
      );
      await render(hbs`<NetworkMap::Detail />`);

      assert
        .dom("[data-test-detail-summary] [data-test-tile-caption]")
        .hasText("Network health");
    });

    test("shows network health status", async function (assert) {
      this.server.get(
        `${ENV.APP.BASE_API_URL}/api/v1/device/:serialNumber/healthchecks`,
        function () {
          return {
            serialNumber: "TEST-TEST",
            values: [
              {
                sanity: 54,
              },
            ],
          };
        }
      );
      await render(hbs`<NetworkMap::Detail @serialNumber="TEST-TEST" />`);

      await waitFor(
        `[data-test-detail-summary] [data-test-status].${deviceWithStatusStyles["--yellow"]}`
      );

      assert
        .dom("[data-test-detail-summary] [data-test-status]")
        .hasClass(deviceWithStatusStyles["--yellow"]);
    });
  });

  module("Connected Devices", function () {
    test("shows summary", async function (assert) {
      await render(hbs`<NetworkMap::Detail />`);

      assert
        .dom("[data-test-connected-devices-summary] [data-test-tile-title]")
        .hasText("0");
      assert
        .dom("[data-test-connected-devices-summary] [data-test-tile-caption]")
        .hasText("Devices connected");
    });
  });
});
