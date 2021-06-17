import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { hash } from "rsvp";

export default class NetworkMapDetailRoute extends Route {
  @service http;

  async model({ serial_number }) {
    return hash({
      accessPoint: this.loadDevice(serial_number),
      connectedDevices: this.loadConnectedDevices(serial_number),
    });
  }

  async loadDevice(serialNumber) {
    try {
      const response = await this.http.get(`/api/v1/device/${serialNumber}`);

      if (response.ok) {
        return response.json();
      }

      return {};
    } catch (error) {
      console.error(error);
    }
  }

  async loadConnectedDevices(serialNumber) {
    try {
      const response = await this.http.get(
        `/api/v1/device/${serialNumber}/connectedDevices`
      );

      if (response.ok) {
        return response.json();
      }

      return [];
    } catch (error) {
      console.error(error);
    }
  }
}
