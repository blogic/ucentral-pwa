import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, triggerEvent } from "@ember/test-helpers";
import Service from "@ember/service";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | uc/network-qr-code", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders a canvas with the QR code", async function (assert) {
    await render(
      hbs`<Uc::NetworkQrCode @ssid="mynetwork" @password="mypass" @encryption="wpa" />`
    );

    assert.dom("[data-test-canvas]").exists();
  });

  test("it draws the QR code when rendering", async function (assert) {
    this.owner.register(
      "service:qr-code",
      class MockQrCodeService extends Service {
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
      class MockQrCodeService extends Service {
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
      class MockQrCodeService extends Service {
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
});
