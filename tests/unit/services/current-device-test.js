import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import { setupMirage } from "ember-cli-mirage/test-support";
import ENV from "ucentral/config/environment";

module("Unit | Service | current-device", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.subject = this.owner.lookup("service:current-device");
  });

  module("#configure", function () {
    test("it makes the correct request", async function (assert) {
      this.subject.data.serialNumber = "AAAA-CCCC";
      this.server.post(
        `${ENV.APP.BASE_API_URL}/api/v1/device/AAAA-CCCC/configure`,
        function (schema, request) {
          assert.deepEqual(JSON.parse(request.requestBody), {
            configuration: {
              ssid: "ssid",
              password: "password",
            },
          });

          return {
            configuration: {},
          };
        }
      );

      await this.subject.configure("ssid", "password");
    });

    test("it udpates its data with the response", async function (assert) {
      this.subject.data.serialNumber = "AAAA-CCCC";
      this.server.post(
        `${ENV.APP.BASE_API_URL}/api/v1/device/AAAA-CCCC/configure`,
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
      await this.subject.configure("ssid", "password");

      assert.deepEqual(this.subject.data, {
        serialNumber: "AAAA-CCCC",
        configuration: {
          ssid: "the-ssid",
          password: "mypass",
          encryption: "wpa2",
          hidden: true,
        },
      });
    });
  });
});
