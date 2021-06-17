import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency";
import { tracked } from "@glimmer/tracking";

export default class NetworkNameFormComponent extends Component {
  @service http;
  @service currentDevice;
  @service intl;
  @service router;

  @tracked
  networkName = this.currentDevice.data.configuration?.ssid;

  @action
  handleNetworkName({ target: { value } }) {
    this.networkName = value;
  }

  @task
  *submitTask(event) {
    event.preventDefault();
    try {
      const response = yield this.http.post(
        `/api/v1/device/${this.currentDevice.data.serialNumber}/configure`,
        JSON.stringify({
          configuration: { ssid: this.networkName },
        })
      );

      if (response.ok) {
        this.router.transitionTo("network-settings.success");
        return;
      }
      return { errorMessage: this.intl.t("errors.somethingWentWrong") };
    } catch (error) {
      console.error(error);

      return { errorMessage: this.intl.t("errors.somethingWentWrong") };
    }
  }
}
