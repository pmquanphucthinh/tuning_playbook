import BaseRoute from 'codecrafters-frontend/utils/base-route';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';

export default class ConceptRoute extends BaseRoute {
  allowsAnonymousAccess = true;
  @service authenticator;
  @service router;
  @service store;

  constructor() {
    super(...arguments);

    this.router.on('routeDidChange', () => {
      scheduleOnce('afterRender', this, scrollToTop);
    });
  }

  async model(params) {
    const allConcepts = await this.store.findAll('concept', { include: 'author,questions' });
    const concept = allConcepts.find((concept) => concept.slug === params.concept_slug);

    const allConceptGroups = await this.store.findAll('concept-group');
    const relatedConceptGroups = allConceptGroups
      .filter((group) => group.conceptSlugs.includes(concept.slug))
      .sort((a, b) => a.slug.localeCompare(b.slug));

    // const allConceptEngagementsForUser = await this.store.findAll('concept-engagement', {
    //   user: this.authenticator.currentUser,
    //   include: 'concept',
    // })

    // console.log('user concept engagements', allConceptEngagementsForUser)

    // const latestConceptEngagementForUser = allConceptEngagementsForUser
    //   .filter((engagement) => engagement.concept.slug === concept.slug)
    //   .sortBy('createdAt')
    //   .at(-1)

    if (this.authenticator.isAuthenticated) {
      await this.store.findAll('concept-engagement', {
        user: this.authenticator.currentUser,
        include: 'concept,user'
      });
    }

    return {
      allConcepts,
      concept,
      conceptGroup: relatedConceptGroups[0],
    };
  }
}
