import Service, { inject as service } from '@ember/service';

export default class FeatureFlagsService extends Service {
  @service analyticsEventTracker;
  @service authenticator;

  constructor() {
    super(...arguments);

    this.notifiedFeatureFlags = new Set();
  }

  get canSeeConceptsIndex() {
    return this.currentUser && this.currentUser.isStaff;
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get canSeeEarlyBirdDiscountBanner() {
    return this.getFeatureFlagValue('can-see-early-bird-discount-banner') === 'test';
  }

  getFeatureFlagValue(flagName) {
    const value = this.currentUser && this.currentUser.featureFlags && this.currentUser.featureFlags[flagName];

    if (!this.notifiedFeatureFlags.has(flagName)) {
      this.analyticsEventTracker.track('feature_flag_called', {
        feature_flag: flagName,
        feature_flag_response: value,
      });

      this.notifiedFeatureFlags.add(flagName);
    }

    return value;
  }
}
