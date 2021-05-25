import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency-decorators";
import { waitForEvent } from "ember-concurrency";

export default class NetworkQrCodeComponent extends Component {
  @service qrCode;

  get settingsString() {
    const { ssid, encryption, password, isHidden = false } = this.args;
    const hidden = isHidden ? "H:true;" : "";

    return `WIFI:T:${encryption.toUpperCase()};${hidden}S:${ssid};P:${password};;`;
  }

  @task({ keepLatest: true })
  *drawTask(canvas) {
    while (true) {
      const { width, height } = canvas;
      yield this.qrCode.toCanvas(canvas, this.settingsString, {
        width,
        height,
      });
      yield waitForEvent(window, "resize");
    }
  }
}
