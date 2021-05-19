import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class AuthService extends Service {
  @tracked isAuthenticated = false;

  async login() {
    const isAuthenticated = true;

    this.isAuthenticated = isAuthenticated;

    return isAuthenticated;
  }
}
