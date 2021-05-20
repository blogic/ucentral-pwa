import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | uc/link-tile", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders a link to the target route", async function (assert) {
    await render(hbs`<Uc::LinkTile @route="index" />`);

    assert.dom("[data-test-link]").hasAttribute("href", "/");
  });
});
