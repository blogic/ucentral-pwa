import Service from "@ember/service";
import ENV from "ucentral/config/environment";
import fetch from "fetch";

export default class HttpService extends Service {
  get(url, queryParams, headers) {
    return this.request(url, queryParams, headers);
  }

  request(urlString, queryParams, headers) {
    return fetch(this.createUrl(urlString, queryParams), {
      headers,
    });
  }

  createUrl(urlString, queryParams = {}) {
    const url = new URL(urlString, ENV.APP.BASE_API_URL);

    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== null && value !== undefined) {
        url.searchParams.set(key, value);
      }
    }

    return url.toString();
  }
}
