import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import deviceWithStatusStyles from "ucentral/components/uc/device-with-status.css";

module("Integration | Component | Uc::DeviceWithStatus", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders the specified SVG", async function (assert) {
    await render(
      hbs`<Uc::DeviceWithStatus @icon="/assets/images/icons/settings.svg" />`
    );

    assert.dom("svg").exists();
  });

  module("Health Status", function () {
    test("it renders green status by default", async function (assert) {
      await render(
        hbs`<Uc::DeviceWithStatus @icon="/assets/images/icons/settings.svg" />`
      );

      assert
        .dom("[data-test-status]")
        .hasClass(deviceWithStatusStyles["--green"]);
    });

    test("it renders green status when health is above or equal 80", async function (assert) {
      await render(
        hbs`<Uc::DeviceWithStatus @icon="/assets/images/icons/settings.svg" @health={{80}} />`
      );

      assert
        .dom("[data-test-status]")
        .hasClass(deviceWithStatusStyles["--green"]);
    });

    test("it renders yellow status when health is below 80", async function (assert) {
      await render(
        hbs`<Uc::DeviceWithStatus @icon="/assets/images/icons/settings.svg" @health={{50}} />`
      );

      assert
        .dom("[data-test-status]")
        .hasClass(deviceWithStatusStyles["--yellow"]);
    });

    test("it renders red status when health is below 40", async function (assert) {
      await render(
        hbs`<Uc::DeviceWithStatus @icon="/assets/images/icons/settings.svg" @health={{30}} />`
      );

      assert
        .dom("[data-test-status]")
        .hasClass(deviceWithStatusStyles["--red"]);
    });
  });
});
