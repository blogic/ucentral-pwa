import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, fillIn, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import inputStyles from "ucentral/components/uc/password-input.css";

const PASSWORD_INPUT = "[data-test-password-input]";
const PASSWORD_VISIBILITY_BUTTON = "[data-test-password-visibility]";
const PASSWORD_VISIBLE_ICON = "[data-test-password-visible]";
const PASSWORD_NOT_VISIBLE_ICON = "[data-test-password-not-visible]";

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

  test("password is hidden by default", async function (assert) {
    await this.renderSubject();

    assert.dom(PASSWORD_VISIBILITY_BUTTON).exists();
    assert.dom(PASSWORD_VISIBLE_ICON).doesNotExist();
    assert.dom(PASSWORD_NOT_VISIBLE_ICON).exists();

    assert.dom(PASSWORD_INPUT).hasAttribute("type", "password");
  });

  test("when toggle is clicked, it renders password in visible state", async function (assert) {
    await this.renderSubject();
    await click(PASSWORD_VISIBILITY_BUTTON);

    assert.dom(PASSWORD_VISIBILITY_BUTTON).exists();
    assert.dom(PASSWORD_VISIBLE_ICON).exists();
    assert.dom(PASSWORD_NOT_VISIBLE_ICON).doesNotExist();

    assert.dom(PASSWORD_INPUT).hasAttribute("type", "text");
  });

  test("password visibility toggling", async function (assert) {
    assert.expect(6);

    await this.renderSubject();
    assert.dom(PASSWORD_VISIBLE_ICON).doesNotExist();
    assert.dom(PASSWORD_NOT_VISIBLE_ICON).exists();

    await click(PASSWORD_VISIBILITY_BUTTON);
    assert.dom(PASSWORD_VISIBLE_ICON).exists();
    assert.dom(PASSWORD_NOT_VISIBLE_ICON).doesNotExist();

    await click(PASSWORD_VISIBILITY_BUTTON);
    assert.dom(PASSWORD_VISIBLE_ICON).doesNotExist();
    assert.dom(PASSWORD_NOT_VISIBLE_ICON).exists();
  });
});
