import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import JSONAPIAdapter from '@ember-data/adapter/json-api';
import JSONAPISerializer from '@ember-data/serializer/json-api';
import PerkModel from 'codecrafters-frontend/models/perk';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';

export default class PerksClaimRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  async model(params: { slug: string }): Promise<{ data: { id: string, attributes: PerkModel } }> {
    const adapter = this.store.adapterFor('application' as never) as JSONAPIAdapter;
    const url = adapter.buildURL() + `/perks/${params.slug}/claim`;
    const rawResponse = await adapter.ajax(url, 'GET');
    const serializer = this.store.serializerFor('application' as never) as JSONAPISerializer;
    const normalizedResponse = serializer.normalizeResponse(this.store, this.store.modelFor('perk'), rawResponse, rawResponse["data"]["id"], 'findRecord') as { data: { id: string, attributes: PerkModel } };

    return normalizedResponse;
  }

  async afterModel(normalizedResponse: { data: { id: string, attributes: PerkModel } }): Promise<void> {
    if (normalizedResponse.data.attributes.claimUrl && this.authenticator.currentUser.canAccessPaidContent) {
      window.location.href = normalizedResponse.data.attributes.claimUrl;
    }
  }
}
