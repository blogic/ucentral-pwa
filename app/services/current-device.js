import Service, { inject as service } from "@ember/service";
import fetch from "fetch";
import ENV from "ucentral/config/environment";
import { tracked } from "@glimmer/tracking";

export default class CurrentDeviceService extends Service {
  @service session;
  @service http;

  @tracked data = {};

  get isConfigured() {
    return Object.keys(this.data?.configuration || {}).length > 0;
  }

  async load() {
    const deviceResponse = await fetch(
      `${ENV.APP.BASE_API_URL}/api/v1/device/${this.session.data.authenticated.serialNumber}`
    );
    const device = await deviceResponse.json();

    this.data = device;

    return device;
  }

  async configure(ssid, password) {
    const response = await this.http.post(
      `${ENV.APP.BASE_API_URL}/api/v1/device/${this.data.serialNumber}/configure`,
      JSON.stringify({
        configuration: {
          ssid,
          password,
        },
      })
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    const { configuration } = await response.json();
    this.data = {
      ...this.data,
      configuration,
    };

    return response;
  }
}
