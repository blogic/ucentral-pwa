import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class ApplicationRoute extends Route {
  @service intl;
  @service auth;
  @service router;

  beforeModel(transition) {
    super.beforeModel(transition);

    if (this.auth.isAuthenticated) {
      this.router.transitionTo("index");
    } else {
      this.router.transitionTo("auth");
    }

    this.intl.setLocale(["en-us"]);
  }
}
