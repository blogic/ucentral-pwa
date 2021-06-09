import Component from "@glimmer/component";
import { task } from "ember-concurrency";
import { inject as service } from "@ember/service";

export default class NetworkMapItemComponent extends Component {
  @service http;

  @task
  *loadHealthChecksTask(serialNumber) {
    try {
      const response = yield this.http.get(
        `/api/v1/devices/${serialNumber}/healthchecks`
      );

      if (response.ok) {
        return yield response.json();
      }

      return {};
    } catch (error) {
      console.error(error);
    }
  }
}
