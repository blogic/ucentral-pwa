import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class QrCodeRoute extends Route {
  @service session;
  @service currentDevice;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, "auth");
  }

  model() {
    return this.currentDevice.load();
  }
}
