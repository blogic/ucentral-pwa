import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class IndexRoute extends Route {
  @service session;
  @service currentDevice;
  @service router;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, "auth");
  }

  async model() {
    return this.currentDevice.load();
  }

  afterModel() {
    if (!this.currentDevice.isConfigured) {
      this.router.transitionTo("network-setup.new");
    }
  }
}
