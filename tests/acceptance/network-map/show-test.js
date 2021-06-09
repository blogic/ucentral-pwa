import { module, test } from "qunit";
import { visit, currentURL } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import {
  authenticateSession,
  invalidateSession,
} from "ember-simple-auth/test-support";

module("Acceptance | network-map/show", function (hooks) {
  setupApplicationTest(hooks);

  test("visiting /network-map/show", async function (assert) {
    await authenticateSession();
    await visit("/network-map/show");

    assert.equal(currentURL(), "/network-map/show");
  });

  test("when not authenticated, redirects to /auth", async function (assert) {
    await invalidateSession();
    await visit("/network-map/show");

    assert.equal(currentURL(), "/auth");
  });
});
