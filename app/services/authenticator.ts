import config from 'codecrafters-frontend/config/environment';
import CurrentUserCacheStorageService from 'codecrafters-frontend/services/current-user-cache-storage';
import RouterService from '@ember/routing/router-service';
import Service from '@ember/service';
import SessionTokenStorageService from 'codecrafters-frontend/services/session-token-storage';
import Store from '@ember-data/store';
import window from 'ember-window-mock';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class AuthenticatorService extends Service {
  @service declare router: RouterService;
  @service declare sessionTokenStorage: SessionTokenStorageService;
  @service declare currentUserCacheStorage: CurrentUserCacheStorageService;
  @service declare store: Store;

  // TODO: See if there's a way around using this
  @tracked isLoadingUser: boolean = false;
  @tracked cacheBuster: number = 0;

  async authenticate(): Promise<void> {
    if (!this.sessionTokenStorage.hasToken) {
      return;
    }

    if (this.currentUserIsLoaded) {
      this.prefillBeaconEmail();

      return;
    }

    const includedResources = [
      'feature_suggestions',
      'referral_activations_as_customer.referrer',
      'referral_links',
      'referral_links.user',
      'team_memberships',
      'team_memberships.team.memberships.user',
      'team_memberships.team.subscriptions',
      'team_memberships.team.pilots',
      'team_memberships.team.payment_methods',
      'subscriptions',
      'subscriptions.user',
    ];

    this.isLoadingUser = true;
    const user = await this.store.createRecord('user').fetchCurrent({ include: includedResources.join(',') });
    this.isLoadingUser = false;

    if (!user) {
      this.logout();
      window.location.reload();

      return;
    }

    this.prefillBeaconEmail();
    this.currentUserCacheStorage.setValues(user.id, user.username);
    this.cacheBuster++;
  }

  // TODO: Update this when User model is converted to typescript
  get currentUser() {
    this.cacheBuster; // Force reload on cacheBuster change

    if (this.currentUserCacheStorage.userId) {
      return this.store.peekRecord('user', this.currentUserCacheStorage.userId);
    } else {
      return null;
    }
  }

  get currentUserIsLoaded(): boolean {
    this.cacheBuster; // Force reload on cacheBuster change

    return !!this.currentUser;
  }

  get currentUserId(): string {
    this.cacheBuster; // Force reload on cacheBuster change

    return this.currentUser ? this.currentUser.id : this.currentUserCacheStorage.userId;
  }

  get currentUsername(): string {
    this.cacheBuster; // Force reload on cacheBuster change

    return this.currentUser ? this.currentUser.username : this.currentUserCacheStorage.username;
  }

  initiateLogin(redirectPath: string | null) {
    if (redirectPath) {
      // @ts-ignore
      window.location.href = `${config.x.backendUrl}/login?next=` + encodeURIComponent(`${window.origin}${redirectPath}`);
    } else if (this.router.currentURL) {
      // @ts-ignore
      window.location.href = `${config.x.backendUrl}/login?next=` + encodeURIComponent(`${window.origin}${this.router.currentURL}`);
    } else {
      //@ts-ignore
      window.location.href = `${config.x.backendUrl}/login?next=` + encodeURIComponent(window.origin);
    }
  }

  logout(): void {
    this.sessionTokenStorage.clear();
    this.currentUserCacheStorage.clear();
    this.cacheBuster++;
  }

  get isAnonymous(): boolean {
    this.cacheBuster; // Force reload on cacheBuster change

    return !this.isAuthenticated;
  }

  get isAuthenticated(): boolean {
    this.cacheBuster; // Force reload on cacheBuster change

    return this.sessionTokenStorage.hasToken;
  }

  prefillBeaconEmail() {
    //@ts-ignore
    if (window.Beacon && this.currentUser && this.currentUser.primaryEmailAddress) {
      //@ts-ignore
      window.Beacon('prefill', {
        email: this.currentUser.primaryEmailAddress,
      });
    }
  }
}
