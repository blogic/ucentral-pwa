import { module, test } from "qunit";
import { visit, currentURL, click, waitFor } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import { setupMirage } from "ember-cli-mirage/test-support";
import {
  authenticateSession,
  invalidateSession,
} from "ember-simple-auth/test-support";
import ENV from "ucentral/config/environment";
import { Response } from "miragejs";

module("Acceptance | network-map", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test("visiting /network-map", async function (assert) {
    await authenticateSession();
    await visit("/network-map");

    assert.equal(currentURL(), "/network-map");
  });

  test("when not authenticated, redirects to /auth", async function (assert) {
    await invalidateSession();
    await visit("/network-map");

    assert.equal(currentURL(), "/auth");
  });

  test("network map link on 'dashboard' redirects to 'network-map'", async function (assert) {
    await authenticateSession({ serialNumber: "configured-serial" });
    await visit("/");

    await click("[data-test-button-network-map]");

    assert.equal(currentURL(), "/network-map");
  });

  test("when device is clicked it redirects to network-map.show", async function (assert) {
    this.server.get(
      `${ENV.APP.BASE_API_URL}/api/v1/devices`,
      function (schema, request) {
        if (request.queryParams.deviceType === "AP") {
          return [
            {
              UUID: "1-1",
              serialNumber: "A-A",
              deviceType: "AP",
              macAddress: "00:1A:C1",
              location: "entrance",
              connectedDevicesCount: 13,
            },
          ];
        }
      }
    );

    await authenticateSession({ serialNumber: "configured-serial" });
    await visit("/network-map");

    await waitFor("[data-test-item='A-A']");
    await click("[data-test-item='A-A']");

    assert.equal(currentURL(), "/network-map/A-A");
  });

  module("Access Points", function () {
    test("handles request failure", async function (assert) {
      this.server.get(
        `${ENV.APP.BASE_API_URL}/api/v1/devices`,
        function (schema, request) {
          if (request.queryParams.deviceType === "AP") {
            return new Response(400, {}, {});
          }

          return new Response(200, {}, []);
        }
      );
      await authenticateSession({ serialNumber: "configured-serial" });
      await visit("/network-map");

      assert
        .dom("[data-test-access-points-summary] [data-test-tile-title]")
        .hasText("0");
      assert
        .dom("[data-test-access-points-summary] [data-test-tile-caption]")
        .hasText("Access points");
    });

    test("shows access points sumnmary", async function (assert) {
      this.server.get(
        `${ENV.APP.BASE_API_URL}/api/v1/devices`,
        function (schema, request) {
          if (request.queryParams.deviceType === "AP") {
            return new Response(200, {}, [
              {
                UUID: "1-1",
                serialNumber: "A-A",
                deviceType: "AP",
                macAddress: "00:1A:C1",
                location: "entrance",
                connectedDevicesCount: 13,
              },
            ]);
          }
        }
      );

      await authenticateSession({ serialNumber: "configured-serial" });
      await visit("/network-map");

      assert
        .dom("[data-test-access-points-summary] [data-test-tile-title]")
        .hasText("1");
      assert
        .dom("[data-test-access-points-summary] [data-test-tile-caption]")
        .hasText("Access points");
    });

    test("shows access point list", async function (assert) {
      this.server.get(
        `${ENV.APP.BASE_API_URL}/api/v1/devices`,
        function (schema, request) {
          if (request.queryParams.deviceType === "AP") {
            return new Response(200, {}, [
              {
                UUID: "1-1",
                serialNumber: "A-A",
                deviceType: "AP",
                macAddress: "00:1A:C1",
                location: "entrance",
                connectedDevicesCount: 13,
              },
            ]);
          }
        }
      );

      await authenticateSession({ serialNumber: "configured-serial" });
      await visit("/network-map");

      assert
        .dom("[data-test-item='A-A'] [data-test-item-location]")
        .hasText("entrance");
      assert
        .dom("[data-test-item='A-A'] [data-test-item-connected-devices]")
        .hasText("13 devices connected");
    });
  });

  module("Connected Devices", function () {
    test("handles request failure", async function (assert) {
      this.server.get(
        `${ENV.APP.BASE_API_URL}/api/v1/devices`,
        function (schema, request) {
          if (request.queryParams.countOnly) {
            return new Response(400, {}, {});
          }

          return new Response(200, {}, []);
        }
      );

      await authenticateSession({ serialNumber: "configured-serial" });
      await visit("/network-map");

      assert
        .dom("[data-test-connected-devices-summary] [data-test-tile-title]")
        .hasText("0");
      assert
        .dom("[data-test-connected-devices-summary] [data-test-tile-caption]")
        .hasText("Devices connected");
    });

    test("shows connected devices sumnmary", async function (assert) {
      this.server.get(
        `${ENV.APP.BASE_API_URL}/api/v1/devices`,
        function (schema, request) {
          if (request.queryParams.countOnly) {
            return new Response(200, {}, { deviceCount: 10 });
          }
        }
      );

      await authenticateSession({ serialNumber: "configured-serial" });
      await visit("/network-map");

      assert
        .dom("[data-test-connected-devices-summary] [data-test-tile-title]")
        .hasText("10");
      assert
        .dom("[data-test-connected-devices-summary] [data-test-tile-caption]")
        .hasText("Devices connected");
    });
  });

  module("/Show", function () {
    test("shows connected devices list", async function (assert) {
      this.server.get(
        `${ENV.APP.BASE_API_URL}/api/v1/device/:serialNumber/connectedDevices`,
        function () {
          return [{ serialNumber: "1" }, { serialNumber: "2" }];
        }
      );

      await authenticateSession({ serialNumber: "configured-serial" });
      await visit("/network-map/TEST-TEST");

      assert.dom("[data-test-device]").exists({ count: 2 });
    });

    test("shows connected devices sumnmary", async function (assert) {
      this.server.get(
        `${ENV.APP.BASE_API_URL}/api/v1/device/:serialNumber`,
        function () {
          return new Response(200, {}, [
            {
              serialNumber: "TEST-SERIAL",
              deviceType: "AP",
            },
          ]);
        }
      );
      this.server.get(
        `${ENV.APP.BASE_API_URL}/api/v1/device/:serialNumber/connectedDevices`,
        function () {
          return [
            {
              serialNumber: "1",
            },
          ];
        }
      );

      await authenticateSession({ serialNumber: "configured-serial" });
      await visit("/network-map/TEST-SERIAL");

      assert
        .dom("[data-test-connected-devices-summary] [data-test-tile-title]")
        .hasText("1");
      assert
        .dom("[data-test-connected-devices-summary] [data-test-tile-caption]")
        .hasText("Devices connected");
    });
  });
});
