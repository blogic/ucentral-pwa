import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | uc/layout", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders the title block", async function (assert) {
    await render(hbs`<Uc::Layout><:title>The title</:title></Uc::Layout>`);

    assert.dom("[data-test-layout-title]").hasText("The title");
  });

  test("it renders the title block", async function (assert) {
    await render(
      hbs`<Uc::Layout><:description>The description</:description></Uc::Layout>`
    );

    assert.dom("[data-test-layout-description]").hasText("The description");
  });

  test("it renders the content block", async function (assert) {
    await render(
      hbs`<Uc::Layout><:content><div data-test-content>The content</div></:content></Uc::Layout>`
    );

    assert.dom("[data-test-content]").exists();
  });
});
