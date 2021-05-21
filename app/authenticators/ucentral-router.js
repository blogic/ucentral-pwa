import Base from "ember-simple-auth/authenticators/base";
import fetch from "fetch";
import RSVP from "rsvp";

export default class UcentralRouterAuthenticator extends Base {
  restore(data) {
    return new RSVP.Promise((resolve, reject) => {
      if (!data || !Object.keys(data).length) {
        return reject("UcentralRouterAuthenticator was provided empty session");
      }
      return resolve(data);
    });
  }

  authenticate(credentials) {
    return new RSVP.Promise(async (resolve, reject) => {
      try {
        const authenticateResponse = await fetch("/authenticate", {
          method: "POST",
          body: JSON.stringify(credentials),
        });

        if (!authenticateResponse.ok) {
          return reject(authenticateResponse);
        }
        const data = await authenticateResponse.json();
        return resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }
}
