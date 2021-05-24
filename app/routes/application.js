import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class ApplicationRoute extends Route {
  @service intl;
  @service router;

  beforeModel() {
    super.beforeModel(...arguments);
    this.intl.setLocale(["en-us"]);
  }
}
