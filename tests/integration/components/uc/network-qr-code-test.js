import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, triggerEvent, click } from "@ember/test-helpers";
import Service from "@ember/service";
import { hbs } from "ember-cli-htmlbars";

class MockQrCodeService extends Service {
  toCanvas() {}

  toDataURL() {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII="; // 1x1 pixel white
  }
}

module("Integration | Component | uc/network-qr-code", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register("service:qr-code", MockQrCodeService);
  });

  test("it renders a canvas with the QR code", async function (assert) {
    await render(
      hbs`<Uc::NetworkQrCode @ssid="mynetwork" @password="mypass" @encryption="wpa" />`
    );

    assert.dom("[data-test-canvas]").exists();
  });

  test("it draws the QR code when rendering", async function (assert) {
    this.owner.register(
      "service:qr-code",
      class extends MockQrCodeService {
        toCanvas(canvas, settingsString) {
          assert.equal(settingsString, "WIFI:T:WPA;S:mynetwork;P:mypass;;");
        }
      }
    );

    await render(
      hbs`<Uc::NetworkQrCode @ssid="mynetwork" @password="mypass" @encryption="wpa" />`
    );
  });

  test("it draws the QR code when rendering for a hidden network", async function (assert) {
    assert.expect(1);

    this.owner.register(
      "service:qr-code",
      class extends MockQrCodeService {
        toCanvas(canvas, settingsString) {
          assert.equal(
            settingsString,
            "WIFI:T:WPA;H:true;S:mynetwork;P:mypass;;"
          );
        }
      }
    );

    await render(
      hbs`<Uc::NetworkQrCode @ssid="mynetwork" @password="mypass" @encryption="wpa" @isHidden={{true}} />`
    );
  });

  test("it redraws the QR code when the window's size changes", async function (assert) {
    let calls = 0;
    this.owner.register(
      "service:qr-code",
      class extends MockQrCodeService {
        toCanvas() {
          calls++;
        }
      }
    );

    await render(
      hbs`<Uc::NetworkQrCode @ssid="mynetwork" @password="mypass" @encryption="wpa" @isHidden={{true}} />`
    );

    await triggerEvent(window, "resize");

    assert.equal(
      calls,
      2,
      "The QR code was drawn twice – on initial render and when the window was resized"
    );
  });

  module("if the navigator supports the Web Sharing API Lvl. 2", function () {
    module("and can share images", function (hooks) {
      hooks.beforeEach(function () {
        this.owner.register(
          "service:navigator",
          class extends Service {
            canShare() {
              return true;
            }
          }
        );
      });

      test("it renders the share button", async function (assert) {
        await render(
          hbs`<Uc::NetworkQrCode @ssid="mynetwork" @password="mypass" @encryption="wpa" @isHidden={{true}} />`
        );

        assert.dom("[data-test-share-qr-code-button]").exists();
      });

      test("clicking the share button shares the QR code image", async function (assert) {
        this.owner.register(
          "service:navigator",
          class extends Service {
            canShare() {
              return true;
            }

            share(data) {
              let [{ name: fileName, type: fileType }] = data.files;
              assert.equal(fileName, "mynetwork.png");
              assert.equal(fileType, "image/png");
            }
          }
        );

        await render(
          hbs`<Uc::NetworkQrCode @ssid="mynetwork" @password="mypass" @encryption="wpa" @isHidden={{true}} />`
        );

        await click("[data-test-share-qr-code-button]");
      });
    });

    module("and cannot share images", function (hooks) {
      hooks.beforeEach(function () {
        this.owner.register(
          "service:navigator",
          class extends Service {
            canShare() {
              return false;
            }
          }
        );
      });

      test("it does not render the share button", async function (assert) {
        await render(
          hbs`<Uc::NetworkQrCode @ssid="mynetwork" @password="mypass" @encryption="wpa" @isHidden={{true}} />`
        );

        assert.dom("[data-test-share-qr-code-button]").doesNotExist();
      });
    });
  });

  module(
    "if the navigator does not support the Web Sharing API Lvl. 2",
    function (hooks) {
      hooks.beforeEach(function () {
        this.owner.register(
          "service:navigator",
          class extends Service {
            canShare() {
              return undefined;
            }
          }
        );
      });

      test("it does not render the share button", async function (assert) {
        await render(
          hbs`<Uc::NetworkQrCode @ssid="mynetwork" @password="mypass" @encryption="wpa" @isHidden={{true}} />`
        );

        assert.dom("[data-test-share-qr-code-button]").doesNotExist();
      });
    }
  );
});
