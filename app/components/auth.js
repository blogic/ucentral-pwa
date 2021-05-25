import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency";

const STEPS = {
  IP_ADDRESS: "IP_ADDRESS",
  PASSWORD: "PASSWORD",
};

export default class AuthComponent extends Component {
  @service intl;
  @service session;
  @service router;
  @service config;

  @tracked currentStep = STEPS.IP_ADDRESS;
  @tracked ipAddress = "";
  @tracked password = "";
  @tracked loginFailedMessage = "";

  get isPasswordStep() {
    return this.currentStep === STEPS.PASSWORD;
  }

  get isIpAddressStep() {
    return this.currentStep === STEPS.IP_ADDRESS;
  }

  get isIpAddressConfirmDisabled() {
    return !this.ipAddress.trim();
  }

  get isPasswordConfirmDisabled() {
    return !this.password.trim() || this.loginTask.isRunning;
  }

  @action
  confirmIpAddress() {
    this.currentStep = STEPS.PASSWORD;
  }

  @action
  async confirmPassword() {
    this.loginFailedMessage = "";

    this.loginTask
      .perform({
        userId: this.ipAddress,
        password: this.password,
      })
      .catch(() => {
        this.currentStep = STEPS.IP_ADDRESS;
        this.loginFailedMessage = this.intl.t("auth.incorrect_credentials");
      });
  }

  @action
  submitForm(event) {
    event.preventDefault();
    if (this.isIpAddressStep) {
      this.confirmIpAddress();
    } else if (this.isPasswordStep) {
      this.confirmPassword();
    }
  }

  @action
  handlePassword(event) {
    this.password = event.target.value;
  }

  @action
  handleIpAddress(event) {
    this.ipAddress = event.target.value;
  }

  @task
  *loginTask(credentials) {
    yield this.session.authenticate(
      "authenticator:ucentral-router",
      credentials
    );
  }
}
