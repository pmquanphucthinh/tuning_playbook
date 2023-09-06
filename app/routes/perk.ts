import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import RouterService from '@ember/routing/router-service';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';

export default class PerkRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;
  @service declare store: Store;

  async model () {
    return await this.store.query('perk', {});
  }

  async afterModel() {
    if (!this.authenticator.currentUser.isStaff) {
      this.router.transitionTo('catalog');
    }
  }
}