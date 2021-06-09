import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { hash } from "rsvp";

export default class NetworkMapRoute extends Route {
  @service http;

  async model() {
    return hash({
      accessPoints: this.loadAccessPoints(),
      totalDevices: this.loadDevicesCount(),
    });
  }

  async loadAccessPoints() {
    try {
      const response = await this.http.get("/api/v1/devices", {
        deviceType: "AP",
      });

      return response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async loadDevicesCount() {
    try {
      const response = await this.http.get("/api/v1/devices", {
        countOnly: true,
      });

      return response.json();
    } catch (error) {
      console.error(error);
    }
  }
}
