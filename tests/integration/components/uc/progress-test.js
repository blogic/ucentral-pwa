import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import dotStyles from "ucentral/components/uc/progress/dot.css";
import strikethroughStyles from "ucentral/components/uc/progress/strikethrough.css";

module("Integration | Component | uc/progress", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    this.steps = ["A", "B"];
    this.currentStep = "A";

    await render(hbs`<Uc::Progress
      @currentStep={{this.currentStep}}
      @steps={{this.steps}}
    />`);

    assert.dom("[data-test-dot='0']").exists();
    assert.dom("[data-test-strikethrough='0']").exists();
    assert.dom("[data-test-dot='1']").exists();
  });

  test("it doesn't render strikethrough if theres only 1 step", async function (assert) {
    this.steps = ["A"];
    this.currentStep = "A";

    await render(hbs`<Uc::Progress
      @currentStep={{this.currentStep}}
      @steps={{this.steps}}
    />`);

    assert.dom("[data-test-dot='0']").exists();
    assert.dom("[data-test-strikethrough='0']").doesNotExist();
  });

  test("first step is always highlighted", async function (assert) {
    this.steps = ["A"];
    this.currentStep = "A";

    await render(hbs`<Uc::Progress
      @currentStep={{this.currentStep}}
      @steps={{this.steps}}
    />`);

    assert.dom("[data-test-dot='0']").hasClass(dotStyles["--visited"]);
  });

  test("it renders strikethrough between two points", async function (assert) {
    this.steps = ["A", "B"];
    this.currentStep = "B";

    await render(hbs`<Uc::Progress
      @currentStep={{this.currentStep}}
      @steps={{this.steps}}
    />`);

    assert.dom("[data-test-dot='0']").exists();
    assert.dom("[data-test-strikethrough='0']").exists();
    assert.dom("[data-test-dot='1']").exists();
    assert.dom("[data-test-strikethrough='1']").doesNotExist();
  });

  test("when on second step, both first and second step are highlighted", async function (assert) {
    this.steps = ["A", "B"];
    this.currentStep = "B";

    await render(hbs`<Uc::Progress
      @currentStep={{this.currentStep}}
      @steps={{this.steps}}
    />`);

    assert.dom("[data-test-dot='0']").hasClass(dotStyles["--visited"]);
    assert.dom("[data-test-dot='1']").hasClass(dotStyles["--visited"]);
  });

  test("when on first step, strikethrough between first and second step is not highlighted", async function (assert) {
    this.steps = ["A", "B"];
    this.currentStep = "A";

    await render(hbs`<Uc::Progress
      @currentStep={{this.currentStep}}
      @steps={{this.steps}}
    />`);

    assert
      .dom("[data-test-strikethrough='0']")
      .doesNotHaveClass(strikethroughStyles["--active"]);
  });

  test("when on second step, strikethrough between first and second step is highlighted", async function (assert) {
    this.steps = ["A", "B"];
    this.currentStep = "B";

    await render(hbs`<Uc::Progress
      @currentStep={{this.currentStep}}
      @steps={{this.steps}}
    />`);

    assert
      .dom("[data-test-strikethrough='0']")
      .hasClass(strikethroughStyles["--active"]);
  });
});
