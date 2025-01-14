import Component from '@glimmer/component';
import window from 'ember-window-mock';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';
import type TeamModel from 'codecrafters-frontend/models/team';

export default class AccountDropdownComponent extends Component {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;
  @service declare store: Store;

  @tracked isCreatingBillingSession = false;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  @action
  handleCommunityClick(dropdownActions: { close: () => void }) {
    window.open('https://discord.gg/DeqUD2P', '_blank');
    dropdownActions.close();
  }

  @action
  handleCreateTeamClick(dropdownActions: { close: () => void }) {
    dropdownActions.close();
    this.router.transitionTo('teams.create');
  }

  @action
  handleForumLinkClick(dropdownActions: { close: () => void }) {
    window.open('https://forum.codecrafters.io/', '_blank');
    dropdownActions.close();
  }

  @action
  handleGetHelpClick(dropdownActions: { close: () => void }) {
    // @ts-expect-error Beacon not registered yet
    window.Beacon('open');
    dropdownActions.close();
  }

  @action
  async handleLogoutClick() {
    await this.router.transitionTo('catalog'); // Isn't safe to logout on any page that assumes "User" is not-null
    const logoutResponse = await this.store.createRecord('session').logout();

    if (logoutResponse.redirect_url) {
      window.location.href = logoutResponse.redirect_url;
    }
  }

  @action
  async handleManageSubscriptionClick(dropdownActions: { close: () => void }) {
    dropdownActions.close();
    this.router.transitionTo('membership');
  }

  @action
  handleManageTeamClick(dropdownActions: { close: () => void }, team: TeamModel) {
    dropdownActions.close();
    this.router.transitionTo('team', team.id);
  }

  @action
  handlePartnerDashboardClick(dropdownActions: { close: () => void }) {
    dropdownActions.close();
    this.router.transitionTo('partner');
  }

  @action
  handlePerksLinkClick(dropdownActions: { close: () => void }) {
    window.open('https://codecrafters.io/perks', '_blank');
    dropdownActions.close();
  }

  @action
  handleReferralsLinkClick(dropdownActions: { close: () => void }) {
    dropdownActions.close();
    this.router.transitionTo('refer');
  }

  @action
  handleSettingsLinkClick(dropdownActions: { close: () => void }) {
    dropdownActions.close();
    this.router.transitionTo('settings');
  }

  @action
  handleStatusPageClick(dropdownActions: { close: () => void }) {
    window.open('https://status.codecrafters.io/', '_blank');
    dropdownActions.close();
  }

  @action
  handleSubscribeClick(dropdownActions: { close: () => void }) {
    dropdownActions.close();
    this.router.transitionTo('pay');
  }

  @action
  handleTestSentryClick() {
    // @ts-expect-error this is supposed to raise an error
    this.testingSentry.boom();
  }

  @action
  handleViewProfileClick(dropdownActions: { close: () => void }) {
    dropdownActions.close();
    this.router.transitionTo('user', this.authenticator.currentUsername!);
  }

  @action
  handleViewTeamClick(dropdownActions: { close: () => void }, team: TeamModel) {
    dropdownActions.close();
    this.router.transitionTo('team', team.id);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Header::AccountDropdown': typeof AccountDropdownComponent;
  }
}
