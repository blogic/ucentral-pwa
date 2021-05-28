import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class QrCodeRoute extends Route {
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, "auth");
  }

  async model() {
    let response = await fetch("/network-settings");
    let {
      ssid,
      password,
      encrypition,
      hidden: isHidden,
    } = await response.json();

    return {
      ssid,
      password,
      encrypition,
      isHidden,
    };
  }
}
