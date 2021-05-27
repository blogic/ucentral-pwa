import Service from "@ember/service";

export default class NavigatorService extends Service {
  canShare() {
    return navigator.canShare?.(...arguments);
  }

  share() {
    return navigator.share?.(...arguments);
  }
}
