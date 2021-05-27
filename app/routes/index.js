import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class IndexRoute extends Route {
  @service session;
  @service currentDevice;
  @service router;

  beforeModel(transition) {
    const isAuthenticated = this.session.requireAuthentication(
      transition,
      "auth"
    );

    if (isAuthenticated && !this.currentDevice.isConfigured) {
      this.router.transitionTo("network-setup.new");
    }
  }
}
