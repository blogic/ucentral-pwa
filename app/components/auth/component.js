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
  @service auth;
  @service router;

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
    return !this.password.trim();
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
        ipAddress: this.ipAddress,
        password: this.password,
      })
      .catch((error) => console.error(error));
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
    const useMockAuthenticator = this.config.getConfig(
      "APP.useMockAuthenticator"
    );
    const authenticator = useMockAuthenticator
      ? "authenticator:mock-ucentral-router"
      : "authenticator:ucentral-router";
    const isAuthenticated = yield this.session.authenticate(
      authenticator,
      credentials
    );

    if (!isAuthenticated) {
      this.currentStep = STEPS.IP_ADDRESS;
      this.loginFailedMessage = this.intl.t("auth.incorrect_credentials");
    }
  }
}
