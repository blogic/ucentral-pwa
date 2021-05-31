import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, fillIn, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl, t } from "ember-intl/test-support";
import dotStyles from "ucentral/components/uc/progress/dot.css";
import strikethroughStyles from "ucentral/components/uc/progress/strikethrough.css";

const goToPasswordStep = async (networkName = "some name") => {
  await fillIn("[data-test-network-name] [data-test-input]", networkName);
  return click("[data-test-confirm-button]");
};

const goToApplyingSettingsStep = async ({
  networkPassword = "some password",
  networkName,
} = {}) => {
  await goToPasswordStep(networkName);
  await fillIn(
    "[data-test-network-password] [data-test-input]",
    networkPassword
  );
  return click("[data-test-confirm-button]");
};

module("Integration | Component | NewSetup", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  module("Steps", function () {
    module("NETWORK_NAME", function () {
      test("has correct title", async function (assert) {
        assert.expect(1);

        await render(hbs`<NewSetup />`);
        assert
          .dom("[data-test-layout-title]")
          .hasText(t("network_setup.wifi_name.title"));
      });

      test("has correct description", async function (assert) {
        assert.expect(1);

        await render(hbs`<NewSetup />`);
        assert
          .dom("[data-test-layout-description]")
          .hasText(t("network_setup.wifi_name.description"));
      });

      test("input has correct label", async function (assert) {
        assert.expect(1);

        await render(hbs`<NewSetup />`);
        assert
          .dom("[data-test-network-name] [data-test-label]")
          .hasText(t("network_setup.wifi_name.label"));
      });

      test("'next' button is disabled when network name is not entered", async function (assert) {
        assert.expect(2);

        await render(hbs`<NewSetup />`);

        assert.dom("[data-test-network-name] [data-test-input]").hasNoValue();
        assert.dom("[data-test-confirm-button]").hasAttribute("disabled");
      });

      test("steps are correctly highlighted", async function (assert) {
        await render(hbs`<NewSetup />`);

        assert.dom("[data-test-dot='0']").hasClass(dotStyles["--visited"]);
        assert
          .dom("[data-test-strikethrough='0']")
          .doesNotHaveClass(strikethroughStyles["--active"]);

        assert
          .dom("[data-test-dot='1']")
          .doesNotHaveClass(dotStyles["--visited"]);
        assert
          .dom("[data-test-strikethrough='1']")
          .doesNotHaveClass(strikethroughStyles["--active"]);

        assert
          .dom("[data-test-dot='2']")
          .doesNotHaveClass(dotStyles["--visited"]);
      });
    });

    module("NETWORK_PASSWORD", function () {
      test("has correct title", async function (assert) {
        assert.expect(1);

        await render(hbs`<NewSetup />`);
        await goToPasswordStep();

        assert
          .dom("[data-test-layout-title]")
          .hasText(t("network_setup.wifi_password.title"));
      });

      test("has correct description", async function (assert) {
        assert.expect(1);

        await render(hbs`<NewSetup />`);
        await goToPasswordStep();

        assert
          .dom("[data-test-layout-description]")
          .hasText(t("network_setup.wifi_password.description"));
      });

      test("input has correct label", async function (assert) {
        assert.expect(1);

        await render(hbs`<NewSetup />`);
        await goToPasswordStep();

        assert
          .dom("[data-test-network-password] [data-test-label]")
          .hasText(t("network_setup.wifi_password.label"));
      });

      test("'next' button is disabled when network password is not entered", async function (assert) {
        assert.expect(2);

        await render(hbs`<NewSetup />`);
        await goToPasswordStep();

        assert
          .dom("[data-test-network-password] [data-test-input]")
          .hasNoValue();
        assert.dom("[data-test-confirm-button]").hasAttribute("disabled");
      });

      test("steps are correctly highlighted", async function (assert) {
        await render(hbs`<NewSetup />`);
        await goToPasswordStep();

        assert.dom("[data-test-dot='0']").hasClass(dotStyles["--visited"]);
        assert
          .dom("[data-test-strikethrough='0']")
          .hasClass(strikethroughStyles["--active"]);

        assert.dom("[data-test-dot='1']").hasClass(dotStyles["--visited"]);
        assert
          .dom("[data-test-strikethrough='1']")
          .doesNotHaveClass(strikethroughStyles["--active"]);

        assert
          .dom("[data-test-dot='2']")
          .doesNotHaveClass(dotStyles["--visited"]);
      });
    });

    module("APPLYING_SETTINGS", function () {
      test("has correct title", async function (assert) {
        assert.expect(1);

        await render(hbs`<NewSetup />`);
        await goToApplyingSettingsStep();
        await waitFor(
          `[data-test-strikethrough='1'].${strikethroughStyles["--active"]}`
        );

        assert
          .dom("[data-test-layout-title]")
          .hasText(t("network_setup.applying_settings.title"));
      });

      test("has correct description", async function (assert) {
        assert.expect(1);
        const currentDeviceService = this.owner.lookup("service:currentDevice");
        currentDeviceService.name = "Dummy";

        await render(hbs`<NewSetup />`);
        await goToApplyingSettingsStep();
        await waitFor(
          `[data-test-strikethrough='1'].${strikethroughStyles["--active"]}`
        );

        assert
          .dom("[data-test-layout-description]")
          .hasText("Your Dummy mesh network is getting started...");
      });

      test("spinner is visible", async function (assert) {
        assert.expect(1);

        await render(hbs`<NewSetup />`);
        await goToApplyingSettingsStep();
        await waitFor(
          `[data-test-strikethrough='1'].${strikethroughStyles["--active"]}`
        );
        assert.dom("[data-test-spinner]").exists();
      });

      test("steps are correctly highlighted", async function (assert) {
        await render(hbs`<NewSetup />`);
        await goToApplyingSettingsStep();
        await waitFor(
          `[data-test-strikethrough='1'].${strikethroughStyles["--active"]}`
        );

        assert.dom("[data-test-dot='0']").hasClass(dotStyles["--visited"]);
        assert
          .dom("[data-test-strikethrough='0']")
          .hasClass(strikethroughStyles["--active"]);

        assert.dom("[data-test-dot='1']").hasClass(dotStyles["--visited"]);
        assert
          .dom("[data-test-strikethrough='1']")
          .hasClass(strikethroughStyles["--active"]);

        assert.dom("[data-test-dot='2']").hasClass(dotStyles["--visited"]);
      });
    });
  });
});
