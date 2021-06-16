import Base from "ember-simple-auth/authenticators/base";
import fetch from "fetch";
import ENV from "ucentral/config/environment";

export default class UcentralRouterAuthenticator extends Base {
  async restore(data) {
    if (!data || !Object.keys(data).length) {
      throw new Error("UcentralRouterAuthenticator was provided empty session");
    }
    return data;
  }

  async authenticate(userId, password) {
    const authenticateResponse = await fetch(
      `${ENV.APP.BASE_API_URL}/api/v1/oauth2`,
      {
        method: "POST",
        body: JSON.stringify({ userId, password }),
      }
    );

    if (!authenticateResponse.ok) {
      throw authenticateResponse;
    }

    const data = await authenticateResponse.json();
    return data;
  }
}
