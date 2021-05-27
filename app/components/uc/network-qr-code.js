import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency-decorators";
import { waitForEvent } from "ember-concurrency";
import dataUriToBlob from "data-uri-to-blob";

export default class NetworkQrCodeComponent extends Component {
  @service qrCode;
  @service navigator;

  @tracked canShare = false;

  constructor() {
    super(...arguments);

    this.prepareSharingTask.perform().catch(() => {
      /* If this fails, sharing simply won't be enabled… */
    });
  }

  get settingsString() {
    const { ssid, encryption, password, isHidden = false } = this.args;
    const hidden = isHidden ? "H:true;" : "";

    return `WIFI:T:${encryption.toUpperCase()};${hidden}S:${ssid};P:${password};;`;
  }

  @task({ drop: true })
  *prepareSharingTask() {
    try {
      let qrCode = yield this.qrCode.toDataURL(this.settingsString, {
        type: "image/png",
      });
      let qrCodeBlob = dataUriToBlob(qrCode);
      this.qrCodeImage = new File([qrCodeBlob], `${this.args.ssid}.png`, {
        type: "image/png",
      });
      this.canShare = this.navigator.canShare({ files: [this.qrCodeImage] });
    } catch (e) {
      //TODO: handle error somehow…
    }
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

  @task({ drop: true })
  *shareTask() {
    try {
      yield this.navigator.share({
        files: [this.qrCodeImage],
      });
    } catch (e) {
      //TODO: handle error somehow…
    }
  }
}
