import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import scrollToTop from 'codecrafters-frontend/lib/scroll-to-top';
import RSVP from 'rsvp';

export default class VoteRoute extends BaseRoute {
  allowsAnonymousAccess = true;
  @service authenticator;
  @service router;
  @service store;

  activate() {
    scrollToTop();
  }

  async model() {
    await this.authenticator.authenticate();

    const modelPromises = {};

    modelPromises.courseIdeas = this.store.findAll('course-idea', {
      include: 'current-user-votes,current-user-votes.user,current-user-supervotes,current-user-supervotes.user',
    });

    modelPromises.courseExtensionIdeas = this.store.findAll('course-extension-idea', {
      include: 'course,current-user-votes,current-user-votes.user,current-user-supervotes,current-user-supervotes.user',
    });

    if (this.authenticator.currentUserId) {
      // No need to wait on this, can load in the background
      this.store.findRecord('user', this.authenticator.currentUserId, {
        include: 'course-idea-supervote-grants,course-extension-idea-supervote-grants',
        reload: true,
      });
    }

    return await RSVP.hash(modelPromises);
  }

  afterModel(model, transition) {
    if (transition.to.name === 'vote.index') {
      this.router.transitionTo('vote.course-ideas');
    }
  }
}
