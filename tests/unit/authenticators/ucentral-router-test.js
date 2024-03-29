import { module, test } from "qunit";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupTest } from "ember-qunit";
import { Response } from "miragejs";
import ENV from "ucentral/config/environment";

module("Unit | Authenticator | UcentralRouterAuthenticator", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.authenticator = this.owner.lookup("authenticator:ucentral-router");
  });

  test("#authenticate makes a request", async function (assert) {
    assert.expect(1);
    this.server.post(`${ENV.APP.BASE_API_URL}/api/v1/oauth2`, () => {
      assert.ok(true, "successfuly hit authenticate endpoint");
      return [200, {}, "{}"];
    });

    await this.authenticator.authenticate();
  });

  test("#authenticate sends payload", async function (assert) {
    assert.expect(1);
    this.server.post(
      `${ENV.APP.BASE_API_URL}/api/v1/oauth2`,
      (schema, request) => {
        assert.deepEqual(JSON.parse(request.requestBody), {
          userId: "192.168.1.1",
          password: "Secret",
        });
        return new Response(200, {}, {});
      }
    );

    await this.authenticator.authenticate("192.168.1.1", "Secret");
  });

  test("#authenticate payload on success is returned", async function (assert) {
    assert.expect(1);
    this.server.post(`${ENV.APP.BASE_API_URL}/api/v1/oauth2`, () => {
      return new Response(200, {}, { serialNumber: "AAAA-CCCC" });
    });

    const data = await this.authenticator.authenticate({
      userId: "192.168.1.1",
      password: "Secret",
    });
    assert.deepEqual(data, { serialNumber: "AAAA-CCCC" });
  });

  test("#authenticate rejects on bad request", async function (assert) {
    assert.expect(1);
    this.server.post(`${ENV.APP.BASE_API_URL}/api/v1/oauth2`, () => {
      return new Response(400, {}, {});
    });

    assert.rejects(
      this.authenticator.authenticate({
        userId: "192.168.1.1",
        password: "Secret",
      })
    );
  });

  test("#restore returns data it received", async function (assert) {
    assert.expect(1);

    const data = await this.authenticator.restore({
      serialNumber: "AAAA-CCCC",
    });

    assert.deepEqual(data, { serialNumber: "AAAA-CCCC" });
  });

  test("#restore throws when it receives empty session object", async function (assert) {
    assert.expect(2);

    try {
      await this.authenticator.restore({});
    } catch (error) {
      assert.ok(error instanceof Error);
      assert.equal(
        error.message,
        "UcentralRouterAuthenticator was provided empty session"
      );
    }
  });

  test("#restore throws when it receives empty session data", async function (assert) {
    assert.expect(2);

    try {
      await this.authenticator.restore();
    } catch (error) {
      assert.ok(error instanceof Error);
      assert.equal(
        error.message,
        "UcentralRouterAuthenticator was provided empty session"
      );
    }
  });
});
