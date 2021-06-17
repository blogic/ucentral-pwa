import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency";
import { tracked } from "@glimmer/tracking";

export default class NetworkPasswordFormComponent extends Component {
  @service http;
  @service currentDevice;
  @service intl;
  @service router;

  @tracked
  newNetworkPassword = "";

  @tracked
  newNetworkPasswordRepeat = "";

  @tracked
  currentNetworkPassword = "";

  @tracked
  passwordNotMatchingError = "";

  @action
  handleNewNetworkPassword({ target: { value } }) {
    this.newNetworkPassword = value;
  }

  @action
  handleNewNetworkPasswordRepeat({ target: { value } }) {
    this.newNetworkPasswordRepeat = value;
  }

  @action
  handleCurrentNetworkPassword({ target: { value } }) {
    this.currentNetworkPassword = value;
  }

  @task
  *submitTask(event) {
    event.preventDefault();

    if (this.newNetworkPassword !== this.newNetworkPasswordRepeat) {
      this.passwordNotMatchingError = this.intl.t(
        "network_settings.wifi_password.errors.password_not_matching"
      );
      return;
    }

    try {
      this.showPasswordNotMatchingError = false;
      const response = yield this.http.post(
        `/api/v1/device/${this.currentDevice.data.serialNumber}/configure`,
        JSON.stringify({
          configuration: {
            password: this.newNetworkPassword,
            currentPassword: this.currentNetworkPassword,
          },
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
