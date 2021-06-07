import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | uc/button", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.renderSubject = async () => {
      this.onClick = this.onClick || function () {};
      return render(hbs`<Uc::Button
        @isLoading={{this.isLoading}}
        {{on "click" this.onClick}}
      />`);
    };
  });

  test("it renders", async function (assert) {
    assert.expect(1);

    await this.renderSubject();
    assert.dom("[data-test-button]").exists();
  });

  test("it can have action defined with on modifier", async function (assert) {
    assert.expect(1);

    this.onClick = () => assert.ok(true, "clicked");
    await this.renderSubject();

    await click("[data-test-button]");
  });

  test("when is loading, applies aria-pressed attribute", async function (assert) {
    this.isLoading = true;
    await this.renderSubject();

    assert.dom("[data-test-button]").hasAttribute("aria-pressed", "true");
  });

  test("when is loading, applies aria-pressed to false attribute", async function (assert) {
    await this.renderSubject();

    assert.dom("[data-test-button]").hasAttribute("aria-pressed", "false");
  });
});
