import { attr, hasMany } from '@ember-data/model';
import { memberAction } from 'ember-api-actions';
import Model from '@ember-data/model';

export default class UserModel extends Model {
  @attr('string') avatarUrl;
  @attr('date') createdAt;
  @attr('string') githubUsername;
  @attr('boolean') isAdmin;
  @attr('boolean') isStaff;
  @attr('boolean') isCodecraftersPartner;
  @attr('string') name;
  @attr('string') username;

  @hasMany('course-language-request', { async: false }) courseLanguageRequests;
  @hasMany('course-extension-idea-vote', { async: false }) courseExtensionIdeaVotes;
  @hasMany('course-extension-idea-supervote', { async: false }) courseExtensionIdeaSupervotes;
  @hasMany('course-extension-idea-supervote-grants', { async: false }) courseExtensionIdeaSupervoteGrants;
  @hasMany('course-idea-vote', { async: false }) courseIdeaVotes;
  @hasMany('course-idea-supervote', { async: false }) courseIdeaSupervotes;
  @hasMany('course-idea-supervote-grants', { async: false }) courseIdeaSupervoteGrants;
  @hasMany('course-participation', { async: false }) courseParticipations;
  @hasMany('feature-suggestion', { async: false }) featureSuggestions;
  @hasMany('free-usage-restriction', { async: false }) freeUsageRestrictions;
  @hasMany('repository', { async: false }) repositories;
  @hasMany('subscription', { async: false }) subscriptions;
  @hasMany('team-membership', { async: false }) teamMemberships;
  @hasMany('user-profile-event', { async: false }) profileEvents;

  get activeSubscription() {
    return this.subscriptions.sortBy('startDate').reverse().findBy('isActive');
  }

  get availableCourseIdeaSupervotes() {
    return this.courseIdeaSupervoteGrants.mapBy('numberOfSupervotes').reduce((a, b) => a + b, 0) - this.courseIdeaSupervotes.length;
  }

  get availableCourseExtensionIdeaSupervotes() {
    return this.courseExtensionIdeaSupervoteGrants.mapBy('numberOfSupervotes').reduce((a, b) => a + b, 0) - this.courseExtensionIdeaSupervotes.length;
  }

  get canAccessPaidContent() {
    return this.isCodecraftersPartner || this.hasActiveSubscription || this.teamHasActiveSubscription || this.teamHasActivePilot;
  }

  canAttemptCourseStage(courseStage) {
    return courseStage.isFirst || this.canAccessPaidContent || this.hasNoFreeUsageRestriction;
  }

  canCreateRepository(/* _course, _language */) {
    // course & language are unused, earlier we used to limit access based on payment status
    return true;
  }

  get completedCourseParticipations() {
    return this.courseParticipations.filterBy('isCompleted');
  }

  get codecraftersProfileUrl() {
    return `/users/${this.username}`;
  }

  get expiredSubscription() {
    if (this.hasActiveSubscription) {
      return null;
    } else {
      return this.subscriptions.sortBy('startDate').reverse().findBy('isInactive');
    }
  }

  get earlyBirdDiscountEligibilityExpiresAt() {
    return new Date(this.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000);
  }

  get freeUsageRestriction() {
    return this.freeUsageRestrictions.filterBy('isActive').sortBy('expiresAt').firstObject;
  }

  get githubProfileUrl() {
    return `https://github.com/${this.githubUsername}`;
  }

  get hasActiveSubscription() {
    return !!this.activeSubscription;
  }

  get hasFreeUsageRestriction() {
    return !!this.freeUsageRestriction;
  }

  get hasNoFreeUsageRestriction() {
    return !this.hasFreeUsageRestriction;
  }

  get isEligibleForEarlyBirdDiscount() {
    return this.earlyBirdDiscountEligibilityExpiresAt > new Date();
  }

  get isTeamAdmin() {
    return !!this.managedTeams.firstObject;
  }

  get isTeamMember() {
    return !!this.teams.firstObject;
  }

  get languagesFromCompletedCourseParticipations() {
    return this.completedCourseParticipations.mapBy('language').uniq();
  }

  get managedTeams() {
    return this.teamMemberships.filterBy('isAdmin').mapBy('team');
  }

  get teamHasActivePilot() {
    return this.teams.isAny('hasActivePilot');
  }

  get teamHasActiveSubscription() {
    return this.teams.isAny('hasActiveSubscription');
  }

  get teams() {
    return this.teamMemberships.mapBy('team');
  }
}

UserModel.prototype.fetchNextInvoicePreview = memberAction({
  path: 'next-invoice-preview',
  type: 'get',

  after(response) {
    if (response.data) {
      this.store.pushPayload(response);

      return this.store.peekRecord('invoice', response.data.id);
    } else {
      return null;
    }
  },
});
