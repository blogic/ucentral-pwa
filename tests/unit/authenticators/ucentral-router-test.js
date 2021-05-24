import { module, test } from "qunit";
import { setupPretender } from "ucentral/tests/helpers/pretender";

module("Unit | Authenticator | UcentralRouterAuthenticator", function (hooks) {
  setupPretender(hooks);

  hooks.beforeEach(function () {
    this.authenticator = this.owner.lookup("authenticator:ucentral-router");
  });

  test("#authenticate makes a request", async function (assert) {
    assert.expect(1);
    this.pretender.post("/authenticate", () => {
      assert.ok(true, "successfuly hit authenticate endpoint");
      return [200, {}, "{}"];
    });

    await this.authenticator.authenticate();
  });

  test("#authenticate sends payload", async function (assert) {
    assert.expect(1);
    this.pretender.post("/authenticate", (request) => {
      assert.deepEqual(JSON.parse(request.requestBody), {
        userId: "192.168.1.1",
        password: "Secret",
      });
      return [200, {}, "{}"];
    });

    await this.authenticator.authenticate({
      userId: "192.168.1.1",
      password: "Secret",
    });
  });

  test("#authenticate payload on success is returned", async function (assert) {
    assert.expect(1);
    this.pretender.post("/authenticate", () => {
      return [200, {}, JSON.stringify({ succeeded: true })];
    });

    const data = await this.authenticator.authenticate({
      userId: "192.168.1.1",
      password: "Secret",
    });

    assert.deepEqual(data, { succeeded: true });
  });

  test("#authenticate rejects on bad request", async function (assert) {
    assert.expect(1);
    this.pretender.post("/authenticate", () => {
      return [400, {}, ""];
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

    const data = await this.authenticator.restore({ succeeded: true });

    assert.deepEqual(data, { succeeded: true });
  });

  test("#restore throws when it receives empty session object", async function (assert) {
    assert.expect(1);

    await assert.rejects(this.authenticator.restore({}), (error) => {
      return error === "UcentralRouterAuthenticator was provided empty session";
    });
  });

  test("#restore throws when it receives empty session data", async function (assert) {
    assert.expect(1);

    await assert.rejects(this.authenticator.restore(), (error) => {
      return error === "UcentralRouterAuthenticator was provided empty session";
    });
  });
});