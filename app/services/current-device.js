import Service, { inject as service } from "@ember/service";
import fetch from "fetch";
import ENV from "ucentral/config/environment";
import { tracked } from "@glimmer/tracking";

export default class CurrentDeviceService extends Service {
  @service session;

  @tracked data = {};

  get isConfigured() {
    return Boolean(this.data.configuration?.trim());
  }

  async load() {
    const deviceResponse = await fetch(
      `${ENV.APP.DEVICE_URL}/${this.session.data.authenticated.serialNumber}`
    );
    const device = await deviceResponse.json();

    this.data = device;

    return device;
  }
}
