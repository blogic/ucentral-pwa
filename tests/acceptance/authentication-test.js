import { module, test } from "qunit";
import { visit, currentURL, fillIn, click } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import { setupMirage } from "ember-cli-mirage/test-support";
import { invalidateSession } from "ember-simple-auth/test-support";
import { Response } from "miragejs";
import ENV from "ucentral/config/environment";

module("Acceptance | authentication", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test("user is redirected to /auth when not authenticated", async function (assert) {
    await invalidateSession();

    await visit("/");

    assert.equal(currentURL(), "/auth");
  });

  test("given user entered incorrect credentials they are not redirected", async function (assert) {
    assert.expect(2);
    this.server.post(`${ENV.APP.BASE_API_URL}/api/v1/oauth2`, () => {
      return new Response(400, {}, {});
    });

    await visit("/");

    await fillIn("[data-test-ip-address] [data-test-input]", "192.168.1.2");
    await click("[data-test-confirm-button]");

    await fillIn("[data-test-password] [data-test-password-input]", "Secret");
    await click("[data-test-confirm-button]");

    assert.equal(currentURL(), "/auth");
    assert.dom("[data-test-ip-address]").exists();
  });

  test("given authenticate endpoint failed to respond, they are not redirected", async function (assert) {
    assert.expect(2);
    await visit("/");

    await fillIn("[data-test-ip-address] [data-test-input]", "192.168.1.2");
    await click("[data-test-confirm-button]");

    await fillIn("[data-test-password] [data-test-password-input]", "Secret");
    await click("[data-test-confirm-button]");

    assert.equal(currentURL(), "/auth");
    assert.dom("[data-test-ip-address]").exists();
  });

  test("given user authenticated to a device with existing configuration, they are redirected to 'index'", async function (assert) {
    this.server.post(`${ENV.APP.BASE_API_URL}/api/v1/oauth2`, () => {
      return new Response(200, {}, { serialNumber: "Dummy" });
    });
    this.server.get(
      `${ENV.APP.BASE_API_URL}/api/v1/device/:serialNumber`,
      (schema, request) => {
        if (request.params.serialNumber === "Dummy") {
          return new Response(
            200,
            {},
            {
              configuration: "some-config",
              serialNumber: "AAAA-CCCC",
              name: "Dummy",
            }
          );
        }
      }
    );

    await visit("/");

    await fillIn("[data-test-ip-address] [data-test-input]", "192.168.1.2");
    await click("[data-test-confirm-button]");

    await fillIn("[data-test-password] [data-test-password-input]", "Secret");
    await click("[data-test-confirm-button]");

    assert.equal(currentURL(), "/");
  });

  test("given user authenticated to a device without existing configuration, they are redirected to 'new network setup'", async function (assert) {
    this.server.post(`${ENV.APP.BASE_API_URL}/api/v1/oauth2`, () => {
      return new Response(200, {}, { serialNumber: "AAAA-CCCC" });
    });
    this.server.get(
      `${ENV.APP.BASE_API_URL}/api/v1/device/:serialNumber`,
      (schema, request) => {
        if (request.params.serialNumber === "Dummy") {
          return new Response(
            200,
            {},
            {
              configuration: "some-config",
              serialNumber: "AAAA-CCCC",
              name: "Dummy",
            }
          );
        }
      }
    );
    await visit("/");

    await fillIn("[data-test-ip-address] [data-test-input]", "192.168.1.2");
    await click("[data-test-confirm-button]");

    await fillIn("[data-test-password] [data-test-password-input]", "Secret");
    await click("[data-test-confirm-button]");

    assert.equal(currentURL(), "/network-setup/new");
  });
});
