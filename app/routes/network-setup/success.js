import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class ApplicationRoute extends Route {
  @service currentDevice;

  beforeModel() {
    let { configuration } = this.currentDevice.data;
    let { ssid, encryption, password } = configuration || {};
    let allRequiredValuesPresent = [ssid, encryption, password].every(
      (e) => e !== null && e !== undefined
    );

    if (!allRequiredValuesPresent) {
      this.transitionTo("index");
    }
  }
}
