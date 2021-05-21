import Base from "ember-simple-auth/authenticators/base";
import RSVP from "rsvp";

export default class UcentralRouterAuthenticator extends Base {
  restore(data) {
    return new RSVP.Promise((resolve) => {
      return resolve(data);
    });
  }

  authenticate() {
    return new RSVP.Promise((resolve) => resolve({ succeeded: true }));
  }
}
