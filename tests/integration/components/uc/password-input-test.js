import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, fillIn } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import inputStyles from "ucentral/components/uc/password-input.css";

module("Integration | Component | uc/password-input", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.renderSubject = async () => {
      this.stubOnChange = this.stubOnChange || function () {};
      return render(hbs`<Uc::PasswordInput
        @onInput={{this.stubOnChange}}
        @value={{this.value}}
        @label={{this.label}}
        @errorMessage={{this.errorMessage}}
        @isError={{this.isError}}
      />`);
    };
  });

  test("it renders", async function (assert) {
    assert.expect(3);
    this.stubOnChange = () => {};
    await render(hbs`<Uc::PasswordInput @onInput={{this.stubOnChange}} />`);

    assert.dom("[data-test-password-input]").exists();
    assert.dom("[data-test-label]").doesNotExist();
    assert.dom("[data-test-password-error]").doesNotExist();
  });

  test("it receives value", async function (assert) {
    assert.expect(1);
    this.value = "123";
    await this.renderSubject();

    assert.dom("[data-test-password-input]").hasValue("123");
  });

  test("onChange returns input event", async function (assert) {
    assert.expect(1);

    this.stubOnChange = (event) => assert.equal(event.target.value, "456");
    await this.renderSubject();

    await fillIn("[data-test-password-input]", "456");
  });

  test("renders label", async function (assert) {
    assert.expect(1);

    this.label = "test label";
    await this.renderSubject();

    assert.dom("[data-test-label]").hasText("test label");
  });

  test("renders error message", async function (assert) {
    assert.expect(1);

    this.errorMessage = "test error";
    await this.renderSubject();

    assert.dom("[data-test-password-error]").hasText("test error");
  });

  test("when is error, applies error class", async function (assert) {
    assert.expect(1);

    this.isError = true;
    await this.renderSubject();

    assert.dom("[data-test-password-input]").hasClass(inputStyles["--error"]);
  });
});
