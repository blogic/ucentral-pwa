import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | dashboard", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders a button to show the network map", async function (assert) {
    await render(hbs`<Dashboard />`);

    assert.dom("[data-test-button-network-map]").exists();
  });

  test("it renders a button to view the QR code", async function (assert) {
    await render(hbs`<Dashboard />`);

    assert.dom("[data-test-button-qr-code]").exists();
  });

  test("it renders a button to edit settings", async function (assert) {
    await render(hbs`<Dashboard />`);

    assert.dom("[data-test-button-edit-settings]").exists();
  });
});
