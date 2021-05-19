import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import buttonStyles from "ucentral/components/uc/button/styles";

module("Integration | Component | uc/input", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.renderSubject = async () => {
      this.onClick = this.onClick || function () {};
      return render(hbs`<Uc::Button
        @isLoading={{this.isLoading}}
        @onClick={{this.onClick}}
      />`);
    };
  });

  test("it renders", async function (assert) {
    assert.expect(3);

    await this.renderSubject();
    assert.dom("[data-test-button]").doesNotExist();
  });

  test("it calls onClick when clicked", async function (assert) {
    assert.expect(1);

    this.onClick = () => assert.ok(true, "clicked");
    await this.renderSubject();

    await click("[data-test-button]");
  });

  test("when is loading, applies loading class and is disabled", async function (assert) {
    assert.expect(2);

    this.isLoading = true;
    await this.renderSubject();

    assert.dom("[data-test-button]").hasClass(buttonStyles["--loading"]);
    assert.dom("[data-test-button]").hasAttribute("disabled");
  });
});
