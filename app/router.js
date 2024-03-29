import EmberRouter from "@ember/routing/router";
import config from "ucentral/config/environment";

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route("auth");
  this.route("network-setup", function () {
    this.route("new");
    this.route("success");
  });
  this.route("qr-code");

  this.route("network-map", function () {
    this.route("index", { path: "/" });
    this.route("show", { path: "/:serial_number" });
  });

  this.route("network-settings", function () {
    this.route("network-password");
    this.route("network-name");
    this.route("success");
  });
});
