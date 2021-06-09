import { module, test } from "qunit";
import { visit, currentURL, click } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import {
  authenticateSession,
  invalidateSession,
} from "ember-simple-auth/test-support";

module("Acceptance | network-map", function (hooks) {
  setupApplicationTest(hooks);

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
    await authenticateSession();
    await visit("/");

    await click("[data-test-button-network-map]");

    assert.equal(currentURL(), "/network-map");
  });
});
